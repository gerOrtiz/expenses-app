'use client';

import AccountHeader from "./header";
import AccountWrapper from "./viewWrapper";

export default function AccountLayout(props) {
  return (<>
    <AccountHeader />
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <section>
          <AccountWrapper />
        </section>
      </div>
    </main>
  </>);
}