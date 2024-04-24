import AccountLayout from "@/components/dashboard/account/layout";
import TSpinner from "@/components/ui/spinner";
import { getAccountData } from "@/lib/user/account-movements";
import { Suspense } from "react";

async function AccountView() {
  const accountObject = await getAccountData();
  return <AccountLayout data={accountObject} />
}

export default function AccountPage() {
  const fallbackWrapper = (
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <section>
          <div className="flex flex-col"><TSpinner /><p>Cargando..</p></div>
        </section>
      </div>
    </main>
  );

  return (<>
    <Suspense fallback={fallbackWrapper}>
      <AccountView />
    </Suspense>
  </>);
}