"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { downloadRentReportPdf } from "@/utils/pdf";

export default function RentPDFButton({ rents = [] }) {
  const [loading, setLoading] = useState(false);

  const download = () => {
    setLoading(true);
    try {
      downloadRentReportPdf(rents);
    } finally {
      setTimeout(() => setLoading(false), 350);
    }
  };

  return (
    <Button type="button" onClick={download} loading={loading} disabled={!rents.length}>
      <FiDownload />
      Download Rent Report
    </Button>
  );
}
