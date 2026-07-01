import PDFDocument from "pdfkit";

/**
 * Converts a number into Indian currency words format.
 * @param {number} num 
 * @returns {string}
 */
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function g(n) {
    if (n < 20) return a[n];
    let digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? "-" + a[digit] : "");
  }

  function h(n) {
    if (n === 0) return "";
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n > 0) {
      if (str !== "") str += "and ";
      str += g(n);
    }
    return str.trim();
  }

  if (num === 0) return "Zero Rupees Only";

  let result = "";
  let crores = Math.floor(num / 10000000);
  num %= 10000000;
  if (crores > 0) result += h(crores) + " Crore ";

  let lakhs = Math.floor(num / 100000);
  num %= 100000;
  if (lakhs > 0) result += h(lakhs) + " Lakh ";

  let thousands = Math.floor(num / 1000);
  num %= 1000;
  if (thousands > 0) result += h(thousands) + " Thousand ";

  let remaining = num;
  if (remaining > 0) result += h(remaining) + " ";

  return result.trim() + " Rupees Only";
}

/**
 * Generates an official PDF receipt for a donation.
 * Writes to a write stream or returns a promise that resolves to a PDF Buffer.
 * @param {Object} donation - The donation record.
 * @returns {Promise<Buffer>}
 */
export function generateReceiptPdf(donation) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Draw primary boundary border
      doc.rect(20, 20, 555, 802).lineWidth(1.5).stroke("#7A9D1C");
      doc.rect(23, 23, 549, 796).lineWidth(0.5).stroke("#ff9933");

      // HEADER
      doc.fillColor("#7A9D1C");
      doc.fontSize(22).font("Helvetica-Bold").text("UDAY FOUNDATION TRUST", 40, 45, { align: "center" });
      
      doc.fillColor("#475569");
      doc.fontSize(9).font("Helvetica").text("Registered Office: Ahmedabad, Gujarat, India", 40, 70, { align: "center" });
      doc.text("Email: contact@udayfoundationtrust.org | Web: www.udayfoundationtrust.org", 40, 83, { align: "center" });
      doc.text("Approved under section 80G of the Income Tax Act, 1961", 40, 96, { align: "center" });

      // Horizontal line
      doc.moveTo(40, 115).lineTo(555, 115).lineWidth(1).stroke("#e2e8f0");

      // TITLE BANNER
      doc.rect(40, 130, 515, 30).fill("#F4F7EB");
      doc.fillColor("#7A9D1C");
      doc.fontSize(12).font("Helvetica-Bold").text("OFFICIAL DONATION RECEIPT (80G TAX EXEMPTION)", 40, 139, { align: "center" });

      // DETAILS BLOCK
      doc.fillColor("#334155");
      doc.fontSize(10);
      
      // Column 1
      doc.font("Helvetica-Bold").text("Receipt Number:", 50, 185);
      doc.font("Helvetica").text(donation.receiptNumber || `UFT/REC-${donation.id?.substring(0, 8).toUpperCase()}`, 150, 185);

      doc.font("Helvetica-Bold").text("Donation Date:", 50, 205);
      const dateStr = donation.createdAt 
        ? new Date(donation.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      doc.font("Helvetica").text(dateStr, 150, 205);

      // Column 2
      doc.font("Helvetica-Bold").text("PAN Ref:", 340, 185);
      doc.font("Helvetica").text(donation.panNumber || "N/A", 410, 185);

      doc.font("Helvetica-Bold").text("Payment ID:", 340, 205);
      doc.font("Helvetica").text(donation.id?.substring(0, 18) || "Direct UPI", 410, 205);

      // Horizontal separator
      doc.moveTo(40, 230).lineTo(555, 230).lineWidth(0.5).stroke("#cbd5e1");

      // DONOR INFORMATION
      doc.fillColor("#1e293b");
      doc.fontSize(11).font("Helvetica-Bold").text("Donor Details", 50, 250);

      doc.fontSize(10);
      doc.font("Helvetica-Bold").text("Name:", 50, 275);
      doc.font("Helvetica").text(donation.donorName, 150, 275);

      doc.font("Helvetica-Bold").text("Email:", 50, 295);
      doc.font("Helvetica").text(donation.email, 150, 295);

      doc.font("Helvetica-Bold").text("Phone:", 50, 315);
      doc.font("Helvetica").text(donation.phone || "N/A", 150, 315);

      doc.font("Helvetica-Bold").text("Address:", 50, 335);
      doc.font("Helvetica").text(donation.address || "N/A", 150, 335, { width: 380, align: "left" });

      // Horizontal separator
      doc.moveTo(40, 375).lineTo(555, 375).lineWidth(0.5).stroke("#cbd5e1");

      // DONATION DETAILS
      doc.fillColor("#1e293b");
      doc.fontSize(11).font("Helvetica-Bold").text("Contribution Details", 50, 395);

      doc.fontSize(10);
      doc.font("Helvetica-Bold").text("Donated Amount:", 50, 420);
      doc.font("Helvetica-Bold").fillColor("#7A9D1C").fontSize(12).text(`INR ${Number(donation.amount).toLocaleString("en-IN")}.00`, 150, 418);
      
      doc.fillColor("#1e293b").fontSize(10);
      doc.font("Helvetica-Bold").text("Amount in Words:", 50, 445);
      doc.font("Helvetica-Oblique").text(numberToWords(Number(donation.amount)), 150, 445);

      doc.font("Helvetica-Bold").text("Purpose:", 50, 470);
      doc.font("Helvetica").text(donation.purpose || "General Donation", 150, 470);

      // Horizontal separator
      doc.moveTo(40, 500).lineTo(555, 500).lineWidth(0.5).stroke("#cbd5e1");

      // LEGAL NOTICES / DECLARATION
      doc.fillColor("#475569");
      doc.fontSize(8);
      doc.font("Helvetica-Bold").text("STATUTORY DECLARATION:", 50, 520);
      
      const statutoryText = 
        "1. Donations made to Uday Foundation Trust are exempt under Section 80G of the Income Tax Act, 1961.\n" +
        "2. This is a computer-generated document and does not require a physical signature. The trust maintains verified digital payment records matching the transaction identifier listed above.\n" +
        "3. Funds received will be strictly utilized for charity and community development works in alignment with the registered objectives of the trust.";
      doc.font("Helvetica").text(statutoryText, 50, 535, { width: 500, lineGap: 4 });

      // SIGNATURE / CERTIFICATION BLOCK
      doc.moveTo(40, 620).lineTo(555, 620).lineWidth(0.5).stroke("#e2e8f0");
      
      doc.fillColor("#334155");
      doc.fontSize(9);
      doc.font("Helvetica-Bold").text("For Uday Foundation Trust", 380, 640, { align: "center" });

      // Simulated Stamp / Seal (Pure Vector representation)
      doc.circle(445, 690, 30).lineWidth(1).stroke("#ff9933");
      doc.fillColor("#ff9933").fontSize(6).font("Helvetica-Bold");
      doc.text("UDAY TRUST", 415, 680, { width: 60, align: "center" });
      doc.text("APPROVED", 415, 692, { width: 60, align: "center" });

      doc.fillColor("#475569").fontSize(8).font("Helvetica-Oblique");
      doc.text("Authorized Representative", 380, 740, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
