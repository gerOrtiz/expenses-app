'use client';

export default function IncomeView() {
  return (<>
    <div className="bg-lime-600 text-right">
      <h3>Ingresos</h3>
    </div>
    <div className="grid grid-cols-3">
      <h3 className="col-span-2">Total $10000</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Quincena</td>
            <td>15 abril</td>
            <td>$10000</td>
          </tr>
        </tbody>
      </table>
    </div>
  </>);
}