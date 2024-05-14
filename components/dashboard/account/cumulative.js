import { updateCumulative } from "@/lib/user/account-movements";
import { faCheck, faInfoCircle, faMinus, faPencil, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardHeader, IconButton, Input, Spinner, Tooltip, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import classes from './cumulative.module.css'

export default function CumulativeView(props) {
  const table_head = ['Nombre', 'Edición', 'Acumulado', '$ X periodo', ''];
  const [cumulativeArray, setCumulativeArray] = useState(props.accountData.cumulative_section || []);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [totals, setTotals] = useState({ totalAmount: 0, totalSugested: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [indexEdited, setIndexEdited] = useState(-1);
  const [actionAmount, setActionAmount] = useState(0);
  const [suggestedAmount, setSuggestedAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function calculateTotals(newArray) {
    let newTotals = { totalAmount: 0, totalSugested: 0 };
    if (!newArray) newArray = [...cumulativeArray];
    newArray.forEach(element => {
      newTotals.totalAmount += element.amount;
      newTotals.totalSugested += element.suggestedAmount;
    });
    setTotals(newTotals);
  }

  useEffect(() => {
    calculateTotals();
  }, []);

  const addCumulative = async (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    const cumulativeObj = {
      name, amount: parseFloat(amount), suggestedAmount: parseFloat(amount), movements: 0
    };
    let newCumulativeArray = [...cumulativeArray];
    newCumulativeArray.push(cumulativeObj);
    await updateCumulative(newCumulativeArray, props.accountData);
    setCumulativeArray(newCumulativeArray);
    setAmount(0);
    setName('');
    setIsSubmitting(false);
    calculateTotals(newCumulativeArray);
  };

  const editCumulative = async (operation, index) => {
    let newAmount = parseFloat(actionAmount);
    if (operation == 'minus') {
      newAmount *= -1;
    }
    const editedAmount = cumulativeArray[index].amount + newAmount;
    let newCumulativeArray = [...cumulativeArray];
    newCumulativeArray[index].amount = editedAmount;
    newCumulativeArray[index].movements += newAmount;
    await updateCumulative(newCumulativeArray, props.accountData);
    setCumulativeArray(newCumulativeArray);
    setActionAmount(0);
    cancelEdition();
    calculateTotals(newCumulativeArray);
  };

  const editSugestedAmount = async (index) => {
    if (isNaN(suggestedAmount)) return;
    let newCumulativeArray = [...cumulativeArray];
    newCumulativeArray[index].suggestedAmount = suggestedAmount;
    await updateCumulative(newCumulativeArray, props.accountData);
    setCumulativeArray(newCumulativeArray);
    setSuggestedAmount(0);
    cancelEdition();
    calculateTotals(newCumulativeArray);
  };

  const enableEdition = (index) => {
    setIndexEdited(index);
    setIsEditing(true);
    setSuggestedAmount(cumulativeArray[index].suggestedAmount);
  };

  const cancelEdition = () => {
    setIndexEdited(-1);
    setIsEditing(false);
  };

  const deleteEntry = async (index) => {
    let newCumulativeArray = [...cumulativeArray];
    newCumulativeArray.splice(index, 1);
    await updateCumulative(newCumulativeArray, props.accountData);
    setCumulativeArray(newCumulativeArray);
    calculateTotals(newCumulativeArray);
  };

  return (<>
    <section className="flex mb-4">
      <Card className="relative w-full">
        <CardHeader className="m-0 text-right" color="blue">
          <Typography variant="h6" className="mr-2">
            Acumulables
            <Tooltip content="Los acumulables son pequeñas cantidades de ahorro que no se descuentan del saldo. Pueden representar gastos futuros que se dividan en parcialidades. Ej. Luz">
              <FontAwesomeIcon className="ml-2 cursor-pointer" icon={faInfoCircle} />
            </Tooltip>
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col">
          <div className="flex-col mb-4">
            {/* <Typography variant="small" color="blue-gray">
              Agrega nuevos acumulados, una vez que tengas uno, este se puede editar fácilmente, puede aumentar o disminuir su valor dependiendo el botón de acción que se utilize (+ -).
            </Typography>
            <Typography variant="small" color="blue-gray">
              Los valores iniciales en la columna "$ X periodo" fungen como recordatorio para próximos periodos, pueden ser editados en cualquier momento y no cambian el valor de lo ya acumulado.
            </Typography> */}
            <form className="flex flex-row gap-4 justify-center" onSubmit={addCumulative}>
              <Input type="text" label="Nombre" containerProps={{ className: "min-w-[24px] max-w-[160px] flex" }} value={name} onChange={(ev) => setName(ev.target.value)}
              />
              <Input type="number" label="Monto" min={0.01} step={0.01} containerProps={{ className: "min-w-[24px] max-w-[100px] flex" }} value={amount} onChange={(ev) => setAmount(ev.target.value)}
              />

              {!isSubmitting && <IconButton variant="outlined" type="submit" disabled={amount <= 0 || !name}>
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>}
              {isSubmitting && <Spinner className="h-6 w-6" />}
            </form>
          </div>
          <div className="gap-3">
            <table className="w-full min-w-max table-auto text-center" >
              <thead>
                <tr>
                  {table_head.map((head, index) => (
                    <th key={index} className="border-b p-2 border-blue-600 bg-blue-200">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cumulativeArray.map((cumulative, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="border-b p-1 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {cumulative.name}
                      </Typography>
                    </td>
                    <td className="border-b p-1 border-blue-gray-50">
                      {isEditing && indexEdited == index &&
                        <div className="flex-row gap-2">
                          <FontAwesomeIcon icon={faMinus} className="pr-2 text-sm cursor-pointer" onClick={() => editCumulative('minus', index)} />
                          <input className={classes.amount} type="number" min={0.01} step={0.01} value={actionAmount} onChange={(ev) => { setActionAmount(ev.target.value) }} />
                          <FontAwesomeIcon icon={faPlus} className="pl-2 text-sm cursor-pointer" onClick={() => editCumulative('plus', index)} />
                        </div>}
                      {!isEditing &&
                        <IconButton variant="text" onClick={() => enableEdition(index)}>
                          <FontAwesomeIcon icon={faPencil} />
                        </IconButton>
                      }
                    </td>
                    <td className="border-b p-2 border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        ${cumulative.amount.toFixed(2)}
                      </Typography>
                    </td>
                    <td className="border-b p-1 border-blue-gray-50">
                      {isEditing && indexEdited == index &&
                        <input className={classes.amount} type="number" min={0.01} step={0.01} value={suggestedAmount} onChange={(ev) => { setSuggestedAmount(parseFloat(ev.target.value)) }} />}
                      {!isEditing &&
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          ${cumulative.suggestedAmount}
                        </Typography>}
                    </td>
                    <td className="border-b p-1 border-blue-gray-50">
                      {isEditing && indexEdited == index &&
                        <>
                          <FontAwesomeIcon className="text-sm cursor-pointer" icon={faCheck} onClick={() => editSugestedAmount(index)} />
                          <FontAwesomeIcon className="pl-2 text-sm cursor-pointer" icon={faTimes} onClick={cancelEdition} />
                        </>
                      }
                      {!isEditing &&
                        <IconButton variant="text" onClick={() => deleteEntry(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      }
                    </td>
                  </tr>
                ))}

              </tbody>
              {cumulativeArray.length > 0 && <tfoot>
                <tr>
                  <td colSpan={2} className="text-left p-4">
                    <Typography variant="small" color="black" className="font-bold">
                      Total
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="black" className="font-bold">
                      $ {totals.totalAmount.toFixed(2)}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="black" className="font-bold">
                      $ {totals.totalSugested.toFixed(2)}
                    </Typography>
                  </td>
                </tr>
              </tfoot>}
            </table>
          </div>
        </CardBody>
      </Card>
    </section>
  </>);
}