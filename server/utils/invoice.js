import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export default function generateInvoice(buyer, seller, auction, amount) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = path.join(process.cwd(), `invoice_${auction.id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text('Auction Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Auction ID: ${auction.id}`);
    doc.text(`Item: ${auction.name}`);
    doc.text(`Description: ${auction.description}`);
    doc.text(`Final Price: ₹${amount}`);
    doc.moveDown();
    doc.text(`Seller: ${seller.name} (${seller.email})`);
    doc.text(`Buyer: ${buyer.name} (${buyer.email})`);
    doc.moveDown();
    doc.text('Thank you for using our Mini Auction System.');

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}
