import * as pdfParse from "pdf-parse";
console.log("pdfParse exports:", pdfParse);
try {
  const { PDFParse } = require("pdf-parse");
  console.log("PDFParse named export:", PDFParse);
} catch (e) {
  console.log("Error requiring pdf-parse:", e);
}
