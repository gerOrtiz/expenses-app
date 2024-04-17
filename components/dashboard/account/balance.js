'use client';

export default function BalanceView() {
  return (<>
    <div className="grid grid-cols-2 gap-10 flex m-4 p-4">
      <div className="flex flex-col bg-lime-600">
        <h3>Disponible</h3>
        <h4>$10000</h4>
      </div>
      <div className="flex flex-col bg-orange-600">
        <h3>Egresos</h3>
        <h4>$1000</h4>
      </div>
    </div>
  </>);
}