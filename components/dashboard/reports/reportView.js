'use client';

import { getData } from "@/lib/user/reports";
import { Accordion, AccordionBody, AccordionHeader, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import DateFilter from "./dateFilter";

export default function ReportViewer(props) {
  const [dateFilter, setDateFilter] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    if (!dateFilter) return;
    retrieveData();
  }, [dateFilter]);

  async function retrieveData() {
    const data = await getData(props.reportType, dateFilter);
    console.log(data);
    setTableData(data);
  }

  const handleOpen = (value) => setOpenAccordion(open === value ? 0 : value);

  return (<>
    <section className="flex-col">
      <div className="grid grid-col-1 items-center justify-center mb-4">
        <DateFilter setDateFilter={setDateFilter} />
      </div>
      <div>
        <h1>Reports here</h1>
        {tableData.length > 0 &&
          <main>
            {tableData[0].groupedExpenses.map((category, index) => (
              <Accordion key={index} open={openAccordion == index + 1}>
                <AccordionHeader onClick={() => handleOpen(index + 1)}>{category.category}: {'$' + category.total}</AccordionHeader>
                <AccordionBody>
                  <table>
                    <thead>
                      <tr>
                        <th>Subcategoría</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.subcategories.map((expense, inx) => (
                        <tr key={inx}>
                          <td>
                            {expense.subcategory}
                          </td>
                          <td>
                            ${expense.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AccordionBody>
              </Accordion>
            ))

            }
          </main>
        }
      </div>
    </section>
  </>);
}