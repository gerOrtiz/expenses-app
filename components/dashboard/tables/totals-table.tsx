'use client';
import { TotalsI, TotalsType } from "@/interfaces/expenses";
import {
	Card,
	CardBody,
	Typography
} from "@material-tailwind/react";


interface TotalsTablePropsI {
	data: TotalsI;
}

export default function TotalsTables({ data }: TotalsTablePropsI) {
	return (
		<div className="relative flex flex-wrap lg:flex-nowrap overflow-hidden gap-4 lg:col-span-3 md:col-span-2 col-span-1 mt-4 p-3">
			{data && (<>
				<SingleTable tableTitle={`Total spent`} data={data.total_expenses} />
				<SingleTable tableTitle={`Payments to make`} data={data.total_pending} />
				<SingleTable tableTitle={`Payments made`} data={data.total_payments_made} />
			</>)
			}
		</div>
	);
}

const SingleTable: React.FC<{ tableTitle: string, data: TotalsType }> = ({ tableTitle, data }) => {
	const headTitles = ['Método de pago', 'Total'];
	return (
		<Card className="mb-1 w-full overflow-hidden">
			<CardBody>
				<section className="relative flex flex-col">
					<Typography variant="h6" color="black" className="font-normal">{tableTitle}</Typography>
					<table className="w-full min-w-max table-auto text-left mt-3  border-collapse">
						<thead >
							<tr>
								{headTitles.map((title, index) => (
									<th key={title} className="p-1" >
										<Typography
											variant="small"
											color="blue-gray"
											className="font-bold"
											style={{ fontSize: '15px' }}
										>
											{title}
										</Typography>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							<tr className="hover:bg-blue-100/80 transition-colors duration-200">
								<td className="p-4 ">
									<Typography variant="small" color="blue-gray" className="font-normal ">
										{`Cash`}
									</Typography>
								</td>
								<td className="p-4 ">
									<Typography variant="small" color="black" className="font-normal">
										{'$' + data.cash}
									</Typography>
								</td>
							</tr>
							<tr className="hover:bg-blue-100/80 transition-colors duration-200">
								<td className="p-4 ">
									<Typography variant="small" color="blue-gray" className="font-normal">
										{`Card`}
									</Typography>
								</td>
								<td className="p-4 ">
									<Typography variant="small" color="black" className="font-normal">
										{'$' + data.card.toFixed(2)}
									</Typography>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr className="hover:bg-blue-100/80 transition-colors duration-200">
								<td className="p-4 ">
									<Typography variant="small" color="blue-gray" className="font-semibold">
										Total
									</Typography>
								</td>
								<td className="p-4">
									<Typography variant="small" color="black" className="font-semibold">
										$ {(data.card + data.cash).toFixed(2)}
									</Typography>
								</td>
							</tr>
						</tfoot>
					</table>
				</section>
			</CardBody>
		</Card>
	);
};
