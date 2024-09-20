import html_to_pdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';

// export async function generatePdfFromHTML(file, fileName = Date.now()) {
//     let options = { format: 'A4' };
//     let pdfBuffer = await html_to_pdf.generatePdf(file, options)
//     let filePath = `public/pdf/${fileName}.pdf`
//     fs.writeFile(filePath, pdfBuffer, function (err) {
//         if (err) return console.log(err);
//         console.log("PDF saved to " + filePath);
//     });
//     return filePath
// }

export async function generatePdfFromHTML(file, fileName = Date.now()) {
    let options = { format: 'A4' };
    let pdfBuffer = await html_to_pdf.generatePdf(file, options);

    let directoryPath = path.join('public', 'pdf');
    let filePath = path.join(directoryPath, `${fileName}.pdf`);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    await new Promise((resolve, reject) => {
        fs.writeFile(filePath, pdfBuffer, (err) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            console.log("PDF saved to " + filePath);
            resolve();
        });
    });

    return filePath;
}

