import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "udayfts1024@gmail.com";

let resend = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
  console.log("✅ Resend client initialized successfully.");
} else {
  console.log("⚠️  RESEND_API_KEY not set. Email service will run in DRY-RUN / MOCK mode (logging to console).");
}

// ── HTML Email Wrapper ────────────────────────────────────────────────────────
function getHtmlTemplate(title, preheader, bodyContent) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
            border: 1px border-solid #e2e8f0;
          }
          .header {
            background-color: #1e3a8a;
            padding: 32px;
            text-align: center;
            border-bottom: 4px solid #f59e0b;
          }
          .logo-text {
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.05em;
            margin: 0;
          }
          .logo-subtext {
            color: #93c5fd;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-top: 4px;
          }
          .content {
            padding: 40px;
            line-height: 1.6;
          }
          .h1 {
            color: #1e3a8a;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 20px;
          }
          p {
            margin-top: 0;
            margin-bottom: 16px;
            font-size: 14px;
            color: #475569;
          }
          .badge {
            display: inline-block;
            padding: 6px 16px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 20px;
          }
          .badge-approved {
            background-color: #d1fae5;
            color: #065f46;
          }
          .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .badge-rejected {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .field-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .field-row {
            margin-bottom: 10px;
            font-size: 13px;
          }
          .field-label {
            font-weight: bold;
            color: #64748b;
            width: 120px;
            display: inline-block;
          }
          .field-value {
            color: #1e293b;
          }
          .footer {
            background-color: #f1f5f9;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .social-links {
            margin-top: 12px;
          }
          .social-links a {
            color: #1e3a8a;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-text">UDAY FOUNDATION TRUST</div>
            <div class="logo-subtext">Service is Culture · Service is True Dharma</div>
          </div>
          <div class="content">
            ${bodyContent}
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0; font-size: 12px;">Uday Foundation Trust, Sanand, Ahmedabad, Gujarat</p>
            <p style="margin: 0 0 12px 0; font-size: 11px;">Registered NGO (Reg No: Guj/23016/Ahmedabad)</p>
            <div class="social-links">
              <a href="https://uday-foundation-trust.vercel.app">Official Website</a> ·
              <a href="https://uday-foundation-trust.vercel.app/contact">Support Desk</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// ── Generic Email Sender ──────────────────────────────────────────────────────
export async function sendMail(to, subject, htmlContent, attachments = []) {
  if (resend) {
    try {
      const data = await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html: htmlContent,
        attachments: attachments.map(att => ({
          filename: att.filename,
          content: att.content,
        })),
      });
      if (data.error) {
        console.error(`❌ Resend failed to send email to ${to}:`, data.error.message);
      } else {
        console.log(`✉️  Email successfully sent to ${to} (${subject}). ID: ${data.data?.id}`);
      }
    } catch (error) {
      console.error(`❌ Resend failed to send email to ${to}:`, error.message);
    }
  } else {
    console.log(`\n--- [MOCK EMAIL DRY-RUN] ---`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${htmlContent.replace(/<[^>]*>/g, " ").trim().substring(0, 300)}...`);
    if (attachments && attachments.length > 0) {
      console.log(`Attachments: ${attachments.map(a => a.filename).join(", ")}`);
    }
    console.log(`-----------------------------\n`);
  }
}

// ── Public API Methods ────────────────────────────────────────────────────────

// 1. Volunteer Received (User Acknowledgement)
export async function sendVolunteerReceived(email, name) {
  const body = `
    <h1 class="h1">Volunteer Application Received</h1>
    <div class="badge badge-pending">Received</div>
    <p>Dear ${name},</p>
    <p>Thank you for your interest in volunteering with <strong>Uday Foundation Trust</strong>.</p>
    <p>Your volunteer application has been received successfully. Our team will review your application details, qualifications, and areas of interest, and notify you of the decision shortly.</p>
    <p>No further actions are required from your end at this moment.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate("Volunteer Application Received", "Application received confirmation", body);
  await sendMail(email, "Volunteer Application Received", html);
}

// 2. Partnership Received (User Acknowledgement)
export async function sendPartnershipReceived(email, contactName, orgName) {
  const body = `
    <h1 class="h1">Partnership Inquiry Received</h1>
    <div class="badge badge-pending">Received</div>
    <p>Dear ${contactName},</p>
    <p>Thank you for reaching out for partnership/collaboration on behalf of <strong>${orgName}</strong>.</p>
    <p>Your partnership proposal has been received successfully. Our coordinator is reviewing your organization type and proposal and will get back to you with custom structures and timelines.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate("Partnership Inquiry Received", "Inquiry received confirmation", body);
  await sendMail(email, "Partnership Inquiry Received", html);
}

// 3. Volunteer Approved
export async function sendVolunteerApproved(email, name) {
  const body = `
    <h1 class="h1">Volunteer Application Approved</h1>
    <div class="badge badge-approved">Approved</div>
    <p>Dear ${name},</p>
    <p><strong>Congratulations!</strong></p>
    <p>Your application to join <strong>Uday Foundation Trust</strong> as a volunteer has been approved. We are thrilled to welcome you to our growing community of change-makers.</p>
    <p>Our program coordinator will reach out to you shortly via phone or email to schedule your onboarding and assign your first service initiative.</p>
    <p>Welcome aboard!</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate("Volunteer Application Approved", "Congratulations! Your application is approved", body);
  await sendMail(email, "Volunteer Application Approved", html);
}

// 4. Partnership Approved
export async function sendPartnershipApproved(email, contactName, orgName) {
  const body = `
    <h1 class="h1">Partnership Request Approved</h1>
    <div class="badge badge-approved">Approved</div>
    <p>Dear ${contactName},</p>
    <p>We are pleased to inform you that the partnership proposal from <strong>${orgName}</strong> has been approved by the board of <strong>Uday Foundation Trust</strong>.</p>
    <p>Our collaboration coordinator will contact you directly within 2 business days to draft the Memorandum of Understanding (MOU) and align project milestones.</p>
    <p>We look forward to a highly impactful association.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate("Partnership Request Approved", "Your partnership request has been approved", body);
  await sendMail(email, "Partnership Request Approved", html);
}

// 5. Volunteer Rejected
export async function sendVolunteerRejected(email, name, reason) {
  const cleanReason = reason || "Thank you for applying. After reviewing your application, we are unable to move forward at this time. We encourage you to apply again in future drives.";
  const body = `
    <h1 class="h1">Volunteer Application Status</h1>
    <div class="badge badge-rejected">Not Accepted</div>
    <p>Dear ${name},</p>
    <p>Thank you for taking the time to apply to Uday Foundation Trust.</p>
    <p>After reviewing your application details, we regret to inform you that we are unable to move forward with your registration at this time.</p>
    <div class="field-box">
      <strong>Decision Note/Reason:</strong><br>
      <span style="color:#64748b; font-size:13px; font-style:italic;">${cleanReason}</span>
    </div>
    <p>We appreciate your interest in serving the community and wish you all the best in your future endeavors.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate("Volunteer Application Status", "Application Status Update", body);
  await sendMail(email, "Volunteer Application Status", html);
}

// 6. Partnership Rejected
export async function sendPartnershipRejected(email, contactName, orgName, reason) {
  const cleanReason = reason || "We regret to inform you that we cannot accommodate your partnership request at this time due to structural capacity constraints.";
  const body = `
    <h1 class="h1">Partnership Inquiry Status</h1>
    <div class="badge badge-rejected">Declined</div>
    <p>Dear ${contactName},</p>
    <p>Thank you for submitting a collaboration inquiry on behalf of <strong>${orgName}</strong>.</p>
    <p>After careful review, we regret to inform you that we cannot pursue this partnership at the present time.</p>
    <div class="field-box">
      <strong>Reviewer's Note:</strong><br>
      <span style="color:#64748b; font-size:13px; font-style:italic;">${cleanReason}</span>
    </div>
    <p>We value your interest and hope we can find opportunities to collaborate in the future.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate("Partnership Inquiry Status", "Partnership Inquiry Status Update", body);
  await sendMail(email, "Partnership Inquiry Status", html);
}

// 7. Admin Alert (Notification to Admin of a new submission)
export async function sendAdminAlert(type, applicantName, details = {}) {
  const isVol = type === "volunteer";
  const fieldsHtml = Object.entries(details)
    .map(([k, v]) => `
      <div class="field-row">
        <span class="field-label">${k}:</span>
        <span class="field-value">${v}</span>
      </div>
    `)
    .join("");

  const body = `
    <h1 class="h1">New ${isVol ? "Volunteer Application" : "Partnership Request"}</h1>
    <p>An admin alert has been triggered: A new registration form has been submitted via the website.</p>
    <div class="field-box">
      <div style="font-weight:bold; margin-bottom:12px; font-size:14px; color:#1e3a8a;">Submission Details:</div>
      ${fieldsHtml}
    </div>
    <p>Please log in to the admin panel to view full documents, photos, resumes, and approve/reject the applicant.</p>
  `;
  const html = getHtmlTemplate(`New ${isVol ? "Volunteer" : "Partnership"} Application`, "New Application Alert", body);
  await sendMail(ADMIN_NOTIFICATION_EMAIL, `Alert: New ${isVol ? "Volunteer" : "Partnership"} Submission`, html);
}

// 8. Donation Confirmation (User Acknowledgement)
export async function sendDonationReceived(email, donorName, amount, txId) {
  const formattedAmount = Number(amount).toLocaleString("en-IN");
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  const body = `
    <h1 class="h1">Thank You for Your Donation!</h1>
    <div class="badge badge-approved">Completed</div>
    <p>Dear ${donorName},</p>
    <p>We are deeply grateful for your generous contribution of <strong>₹${formattedAmount}</strong> to <strong>Uday Foundation Trust</strong>.</p>
    <p>Your support helps us continue our vital community welfare, educational, and healthcare initiatives across rural Gujarat.</p>
    
    <div class="field-box">
      <div style="font-weight:bold; margin-bottom:12px; font-size:14px; color:#1e3a8a;">Transaction Details:</div>
      <div class="field-row">
        <span class="field-label">Transaction ID:</span>
        <span class="field-value">${txId}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Amount Paid:</span>
        <span class="field-value">₹${formattedAmount}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Date:</span>
        <span class="field-value">${dateStr}</span>
      </div>
    </div>
    
    <p>A formal donation receipt eligible for 80G tax exemption will be generated and emailed to you shortly once the audit process completes.</p>
    <p>Thank you again for making a difference.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate("Thank You For Your Donation", "Donation receipt confirmation", body);
  await sendMail(email, "Thank You For Your Donation", html);
}
