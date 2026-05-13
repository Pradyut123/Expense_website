import * as XLSX from 'xlsx';

export const exportToExcel = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert("No transactions to export!");
    return;
  }

  try {
    // Format data for Excel
    const worksheetData = transactions.map(t => ({
      Date: t.date ? new Date(t.date).toLocaleDateString() : 'N/A',
      Title: t.title || 'Untitled',
      Type: (t.type || 'expense').toUpperCase(),
      Category: t.category || 'Other',
      Amount: t.amount || 0,
      Notes: t.notes || ''
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create Blob (Using octet-stream is sometimes more robust for downloads)
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    // Create Download Link
    const fileName = `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    console.log("Downloading file:", fileName);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    
    // Trigger Download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error("Export Error:", error);
    alert("Failed to export Excel file. Check console for details.");
  }
};
