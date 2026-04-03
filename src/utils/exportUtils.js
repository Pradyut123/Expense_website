import * as XLSX from 'xlsx';

export const exportToExcel = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert("No transactions to export!");
    return;
  }

  // Format data for Excel
  const worksheetData = transactions.map(t => ({
    Date: new Date(t.date).toLocaleDateString(),
    Title: t.title,
    Type: t.type.toUpperCase(),
    Category: t.category,
    Amount: t.amount,
    Notes: t.notes || ''
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `Finance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};
