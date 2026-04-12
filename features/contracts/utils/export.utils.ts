import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { type Contract, type Prisma } from "@prisma/client";

interface ContractKeyPoints {
  guarantees?: string[];
  exclusions?: string[];
  franchise?: string | number | null;
  [key: string]: any;
}

export const isContractKeyPoints = (
  val: Prisma.JsonValue | null | undefined,
): val is ContractKeyPoints => {
  if (!val || typeof val !== "object" || Array.isArray(val)) return false;
  return true;
};

export const stripMarkdown = (text: string | null | undefined): string => {
  if (!text) return "";
  // Strip ** bold tags, __ italic tags, # headers, • bullets
  return text
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/•\s+/g, "- ")
    // replace any remaining markdown stars
    .replace(/\*/g, "");
};

const formatValue = (val: any): string => {
  if (val === null || val === undefined) return "N/A";
  if (val instanceof Date) return val.toLocaleDateString();
  if (Array.isArray(val)) {
    return val.map((v) => stripMarkdown(String(v))).join("\n");
  }
  return stripMarkdown(String(val));
};

export const exportToCSV = (contract: Contract) => {
  let guarantees = "N/A";
  let exclusions = "N/A";
  let franchise = "N/A";

  if (isContractKeyPoints(contract.keyPoints)) {
    if (Array.isArray(contract.keyPoints.guarantees)) {
      guarantees = contract.keyPoints.guarantees.map(stripMarkdown).join("; ");
    }
    if (Array.isArray(contract.keyPoints.exclusions)) {
      exclusions = contract.keyPoints.exclusions.map(stripMarkdown).join("; ");
    }
    if (contract.keyPoints.franchise) {
      franchise = stripMarkdown(String(contract.keyPoints.franchise));
    }
  }

  const exportData = [
    ["Field", "Value"],
    ["Title", formatValue(contract.title)],
    ["Provider", formatValue(contract.provider)],
    ["Policy Number", formatValue(contract.policyNumber)],
    ["Start Date", formatValue(contract.startDate)],
    ["End Date", formatValue(contract.endDate)],
    ["Status", formatValue(contract.status)],
    ["Summary", formatValue(contract.summary).replace(/\n/g, " ")],
    ["Guarantees", guarantees],
    ["Exclusions", exclusions],
    ["Deductible", franchise],
  ];

  const csvContent = exportData
    .map((row) =>
      row
        .map((cell) => {
          const stringCell = String(cell);
          if (stringCell.includes(",") || stringCell.includes("\"") || stringCell.includes("\n")) {
            return `"${stringCell.replace(/"/g, "\"\"")}"`;
          }
          return stringCell;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `Analysis_${contract.fileName || "Contract"}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};

export const exportToPDF = (contract: Contract) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(33, 43, 54);
  doc.text("AI Contract Analysis", 14, 22);

  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Filename: ${contract.fileName}`, 14, 30);
  doc.text(`Exported: ${new Date().toLocaleDateString()}`, 14, 36);

  let guarantees = "N/A";
  let exclusions = "N/A";
  let franchise = "N/A";

  if (isContractKeyPoints(contract.keyPoints)) {
    if (Array.isArray(contract.keyPoints.guarantees)) {
      guarantees = contract.keyPoints.guarantees.map(stripMarkdown).join("\n• ");
      if (guarantees) guarantees = "• " + guarantees;
    }
    if (Array.isArray(contract.keyPoints.exclusions)) {
      exclusions = contract.keyPoints.exclusions.map(stripMarkdown).join("\n• ");
      if (exclusions) exclusions = "• " + exclusions;
    }
    if (contract.keyPoints.franchise) {
      franchise = stripMarkdown(String(contract.keyPoints.franchise));
    }
  }

  const tableData = [
    ["Title", formatValue(contract.title)],
    ["Provider", formatValue(contract.provider)],
    ["Policy Number", formatValue(contract.policyNumber)],
    ["Start Date", formatValue(contract.startDate)],
    ["End Date", formatValue(contract.endDate)],
    ["Summary", formatValue(contract.summary)],
    ["Guarantees", guarantees],
    ["Exclusions", exclusions],
    ["Deductible", franchise],
  ];

  autoTable(doc, {
    startY: 45,
    head: [["Information Field", "Extracted Detail"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      overflow: "linebreak",
      cellWidth: "wrap"
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: "bold", textColor: [50, 50, 50] },
      1: { cellWidth: 140 }
    },
  });

  doc.save(`Analysis_${contract.fileName || "Contract"}.pdf`);
};
