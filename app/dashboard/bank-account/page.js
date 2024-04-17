import AccountLayout from "@/components/dashboard/account/layout";
import TSpinner from "@/components/ui/spinner";
import { Suspense } from "react";

async function AccountView() {
  return <AccountLayout />
}

export default function AccountPage() {
  const wrapper = (
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <section>
          <div className="flex flex-col"><TSpinner /><p>Fetching data...</p></div>
        </section>
      </div>
    </main>
  );

  return (<>
    <Suspense fallback={wrapper}>
      <AccountView />
    </Suspense>
  </>);
}