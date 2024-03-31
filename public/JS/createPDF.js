document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("download-pdf");
  if (element) {
    // Function to create PDF
element.addEventListener("click", async () => {
  try {

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Variable to track the vertical position throughout the document
    let y = 40;

    // Define the horizontal positions for each column
    const columnPositions = [15, 60, 150];

    // Function to add spacing
    const addSpacing = (amount) => {
      y += amount;
    };

    const sanitizeString = (input) => {
      return input.replace(/[^\x20-\x7E]/g, ''); // Removes characters outside the printable ASCII range
    };

    // BUDGET TITLE:
    let budgetName = document.querySelector(".pdf-title").textContent.trim();
    budgetName = sanitizeString(budgetName); // Sanitize the input string
    doc.setFontStyle("bold");
    doc.setFontSize(24);
    doc.text(budgetName, 15, 20);

    // BUDGET AMOUNT:
    doc.setFontStyle("bold");
    doc.setFontSize(14);
    doc.text("Budget:", 15, y);
    addSpacing(10);
    const budget = document.querySelector("#budget").textContent.trim();
    doc.setFontStyle("normal");
    doc.text(budget, 15, y);

    // REMAINING BUDGET AMOUNT:
    doc.setFontStyle("bold");
    doc.setFontSize(14);
    doc.text("Verbleibend:", 150, y - 10);
    addSpacing(10);
    const remainingBudgetElement = document.querySelector("#remainingBudget").textContent.trim();
    const remainingBudget = parseFloat(remainingBudgetElement.replace("CHF", "").trim());
    if (remainingBudget >= 0) {
      doc.setTextColor(0, 128, 0); // Green color
    } else {
      doc.setTextColor(255, 0, 0); // Red color
    }
    doc.setFontStyle("normal");
    doc.text(`CHF ${remainingBudget.toFixed(2).toString()}`, 150, y - 10);
    doc.setTextColor(0, 0, 0); // resetting the color to black

    addSpacing(20);

    // GETTING DATA FOR THE TABLE:
    // Extract the data from the HTML content
    const expensesTable = document.querySelector(".transactions-table");
    const extractedData = [];
    expensesTable.querySelectorAll("tr").forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 2) {
        const description = cells[0].querySelector(".transaction-description").textContent.trim();
        const amount = cells[1].textContent.trim();
        const date = cells[0].querySelector(".transaction-date").textContent.trim();
        extractedData.push([date, description, amount]);
      }
    });

    // TABLE HEADER:
    const headers = ["Datum", "Beschreibung", "Betrag"];
    doc.setFontStyle("bold");
    doc.setFontSize(12);
    headers.forEach((header, index) => {
      doc.text(header, columnPositions[index], y);
    });

    addSpacing(10);

    // TABLE DATA:
    doc.setFontStyle("normal");
    doc.setFontSize(12);
    extractedData.forEach(row => {
      row.forEach((cell, index) => {
        doc.text(cell, columnPositions[index], y);
      });
      addSpacing(10);
    });

    addSpacing(10);

    // CREATION DATE:
    const creationDate = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.text(`Generiert: ${creationDate}`, 15, y);

    // Save the PDF document
    doc.save(`${budgetName}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
  }
});
  }
});

