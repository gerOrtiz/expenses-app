'use client';

export default function SavingPotsView() {
  return (<>
    <div className="bg-amber-300 text-right">
      <h3>Apartados</h3>
    </div>
    <div className="flex-1">
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Quincena</td>
            <td>$100</td>
          </tr>
        </tbody>
      </table>
    </div>
  </>);
}