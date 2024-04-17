'use cient';

export default function ExpensesView() {
  return (<>
    <div className="bg-lime-600 text-right">
      <h3>Gastos</h3>
    </div>
    <div className="flex m-6 p-4">
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Subcategoria</th>
            <th>Monto</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ahorro</td>
            <td>Nu bank</td>
            <td>$300</td>
            <td>Ahorro a cuenta con rendimientos</td>
            <td> 15 abril</td>
          </tr>
        </tbody>
      </table>
    </div>

  </>)
}