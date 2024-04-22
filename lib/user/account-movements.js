'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAccount, setAccount, setExpenses, setIncomes, setRemaining, setSavingPots, setWithdrawals } from "@/services/account-movements.service";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDB, convertToObjectId } from "../db";

async function setInitialValues() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/user');
  let client;
  try {
    client = await connectToDB();
    const db = client.db();
    //const collection = db.collection('account-categories');
    return { session, client, db };
  } catch (error) {
    throw new Error('Error: Could not connect to DB');
  }
}

async function getAccountValues(account) {
  const { client, db } = await setInitialValues();
  const collection = db.collection('account_movements');
  const newAccountId = convertToObjectId(account.id);
  try {
    const currentAccount = await collection.findOne({ _id: newAccountId });
    return { client, collection, currentAccount };
  } catch (error) {
    client.close();
    throw new Error('Something went wrong with the database, please try again');
  }
}

export async function getAccountData() {
  const { session, client, db } = await setInitialValues();
  let collection = db.collection('account-recurrent-data');
  try {
    const recurrentData = await collection.findOne({ user_id: session.user.email });
    if (!recurrentData) { client.close(); return {}; }
    collection = db.collection('account_movements');
    const accountMovements = await collection.findOne({ user_id: session.user.email, status: 'active' });
    client.close();
    let response = { recurrentData: recurrentData ? recurrentData : null, accountMovements: accountMovements ? accountMovements : null };
    if (recurrentData.last_balance && !response.accountMovements) response.accountMovements = { initBalance: recurrentData.last_balance, remaining: recurrentData.last_balance };
    if (response.recurrentData) {
      delete response.recurrentData._id;
    }
    if (response.accountMovements) {
      response.accountMovements.id = response.accountMovements._id.toString();
      delete response.accountMovements._id;
    }
    return response;
  } catch (error) {
    client.close();
    throw new Error('Something went wrong with the database, please try again');
  }
}

export async function createCategories(categoryList) {
  const { session, client, db } = await setInitialValues();
  const collection = db.collection('account-recurrent-data');
  const categoriesObj = {
    user_id: session.user.email,
    categories: categoryList
  };
  try {
    const response = await collection.findOne({ user_id: session.user.email });
    let currentData;
    if (!response) {
      currentData = await collection.insertOne(categoriesObj);
    } else {
      currentData = await collection.updateOne({ _id: response._id }, {
        $set: { categories: categoryList },
        $currentDate: { lastModified: true }
      });
    }
    client.close();
    revalidatePath('/dashboard/bank-account');
    return { message: 'Guardado con éxito' };
  } catch (error) {
    //return { error: 'Something went wrong, please try again' };
    throw new Error('Something went wrong with the database, please try again');
  }

}

function setAccountInitialData(user_id) {
  return {
    user_id: user_id,
    sDate: new Date().getTime(),
    status: 'active',
    incomes: [],
    withdrawals: [],
    expenses: [],
    saving_pots: [],
    cumulative_section: []
  };
}

export async function setNewAccount(initialBalance) { //Should only be used when there is no previous data
  if (isNaN(initialBalance)) throw new Error('Error: Está tratando de agregar una cantidad no númerica');
  const { session, client, db } = await setInitialValues();
  let newAccount = setAccountInitialData(session.user.email);
  newAccount.initBalance = initialBalance;
  newAccount.remaining = initialBalance;
  newAccount.totalExpenses = 0;
  const collection = db.collection('account_movements');
  try {
    const response = await collection.insertOne(newAccount);
    client.close();
    if (!response || response.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
    revalidatePath('/dashboard/bank-account');
    newAccount.id = newAccount._id.toString();
    delete newAccount._id;
    return newAccount;
  } catch (error) {
    throw new Error('Something went wrong with the database, please try again');
  }
}

export async function updateIncomeList(incomeList, account) {
  if (!Array.isArray(incomeList)) throw new Error('Error: No se envío la lista de ingresos');
  const { client, db } = await setInitialValues();
  const collection = db.collection('account_movements');
  const newAccountId = convertToObjectId(account.id);
  try {
    const currentAccount = await collection.findOne({ _id: newAccountId });
    if (currentAccount) {
      setAccount(currentAccount);
      setIncomes(incomeList);
      const remaining = setRemaining();
      const response = await collection.updateOne({ _id: currentAccount._id }, {
        $set: { incomes: incomeList, remaining: remaining },
        $currentDate: { lastModified: true }
      });
      client.close();
      return getAccount();
    } else return null;/**soon to have new data */

  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong with the database, please try again');
  }
}

export async function updateAccountExpenses(expensesList, account) {
  if (!Array.isArray(expensesList)) throw new Error('Error: No se envío la lista de ingresos');
  const { client, db } = await setInitialValues();
  const collection = db.collection('account_movements');
  const newAccountId = convertToObjectId(account.id);
  try {
    const currentAccount = await collection.findOne({ _id: newAccountId });
    if (currentAccount) {
      setAccount(currentAccount);
      const { expenses, total_expenses } = setExpenses(expensesList);
      const remaining = setRemaining();
      const response = await collection.updateOne({ _id: currentAccount._id }, {
        $set: { expenses: expenses, total_expenses: total_expenses, remaining: remaining },
        $currentDate: { lastModified: true }
      });
      client.close();
      return getAccount();
    }
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong with the database, please try again');
  }
}

export async function updateSavingPots(savingPots, account) {
  if (!Array.isArray(savingPots)) throw new Error('Error: No se envío la lista de ingresos');
  const { client, collection, currentAccount } = await getAccountValues(account);
  if (currentAccount) {
    setAccount(currentAccount);
    const { saving_pots, total_savingPots } = setSavingPots(savingPots);
    const { remaining, total_expenditure } = setRemaining();
    const response = await collection.updateOne({ _id: currentAccount._id }, {
      $set: { saving_pots, total_savingPots, remaining, total_expenditure },
      $currentDate: { lastModified: true }
    });
    client.close();
    return getAccount();
  }
}

export async function updateWithdrawals(withdrawalsData, account) {
  if (!Array.isArray(withdrawalsData)) throw new Error('Error: No se envío la lista de retiros');
  const { client, collection, currentAccount } = await getAccountValues(account);
  if (currentAccount) {
    setAccount(currentAccount);
    const { withdrawals, total_withdrawals } = setWithdrawals(withdrawalsData);
    const { remaining, total_expenditure } = setRemaining();
    const response = await collection.updateOne({ _id: currentAccount._id }, {
      $set: { withdrawals, total_withdrawals, remaining, total_expenditure },
      $currentDate: { lastModified: true }
    });
    client.close();
    return getAccount();
  }
}