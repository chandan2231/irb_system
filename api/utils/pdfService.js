
import html_to_pdf from 'html-pdf-node'
import fs from 'fs';

export async function generatePdfFromHTML(file, fileName = Date.now()) {
    let options = { format: 'A4' };
    let pdfBuffer = await html_to_pdf.generatePdf(file, options)
    let filePath = `public/pdf/${fileName}.pdf`
    fs.writeFile(filePath, pdfBuffer, function (err) {
        if (err) return console.log(err);
        console.log("PDF saved to " + filePath);
    });
    return filePath
}

