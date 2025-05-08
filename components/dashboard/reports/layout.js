'use client';

import { useState } from "react";
import ReportsHeader from "./header";
import ReportTypeGrid from "./reportTypeGrid";
import ReportViewer from "./reportView";

export default function ReportsLayout() {
  const [reportType, setReportType] = useState(0);

  return (<>
    <ReportsHeader />
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        {reportType == 0 && <ReportTypeGrid setReportType={setReportType} />}
        {reportType != 0 && <ReportViewer reportType={reportType} />}
      </div>
    </main>
  </>);
}