import { Resend } from "resend";
import dotenv from "dotenv";
import { supabase } from "../config/db.js";

dotenv.config();

// Environment Variables binding with PRD specifications & legacy fallbacks
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || "onboarding@resend.dev";
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || "Uday Foundation Trust";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || "udayfts1024@gmail.com";

let resend = null;

if (RESEND_API_KEY && RESEND_API_KEY !== "YOUR_RESEND_API_KEY_HERE" && RESEND_API_KEY.trim() !== "") {
  resend = new Resend(RESEND_API_KEY);
  console.log("✅ Resend client initialized successfully for production email notifications.");
} else {
  console.log(
    "⚠️  RESEND_API_KEY not set. Email service will run in DRY-RUN / MOCK mode (logging to console and immediately database-marked as sent)."
  );
}

// ── HTML Responsive Template Wrapper ──────────────────────────────────────────
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
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: #1e3a8a;
            padding: 32px;
            text-align: center;
            border-bottom: 4px solid #7a9d1c;
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
            width: 150px;
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
            <p style="margin: 0 0 12px 0; font-size: 11px;">Registered NGO (Reg No: Guj/23016/Ahmedabad) | Email: ${ADMIN_EMAIL}</p>
            <div class="social-links">
              <a href="https://www.udayfoundationstrust.org">Official Website</a> ·
              <a href="https://www.udayfoundationstrust.org/contact">Support Desk</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// ── Email Logging & Background Processing Queue ────────────────────────────────

/**
 * Pushes an email into the database log and triggers background transmission.
 */
export async function queueEmail(recipient, subject, htmlContent, template, attachments = []) {
  try {
    // 1. Insert log record into PostgreSQL email_logs table
    const { data: logRecord, error } = await supabase
      .from("email_logs")
      .insert([
        {
          recipient,
          subject,
          template,
          status: "pending",
          retry_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[EmailQueue] Database logging failed:", error.message);
      // Even if DB fails, do not crash the app. Try to send email anyway.
      processEmailDirect(null, recipient, subject, htmlContent, attachments).catch(() => {});
      return;
    }

    console.log(`[EmailQueue] Queued email to ${recipient} (Template: ${template}). Log ID: ${logRecord.id}`);

    // 2. Process asynchronously to prevent blocking the API thread
    setImmediate(() => {
      processEmail(logRecord.id, htmlContent, attachments).catch((err) => {
        console.error(`[EmailQueue] Processing failed for Log ID ${logRecord.id}:`, err.message);
      });
    });
  } catch (err) {
    console.error("[EmailQueue] Critical queue error:", err.message);
  }
}

/**
 * Sends mail directly via Resend or log to console in mock mode.
 */
async function processEmailDirect(logId, recipient, subject, htmlContent, attachments) {
  const fromHeader = `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`;

  if (resend) {
    const formattedAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.content.toString("base64"),
    }));

    const response = await resend.emails.send({
      from: fromHeader,
      to: recipient,
      subject,
      html: htmlContent,
      attachments: formattedAttachments,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data?.id;
  } else {
    // DRY-RUN / MOCK MODE: Immediately complete
    console.log(`\n--- [MOCK EMAIL DRY-RUN] ---`);
    console.log(`To:         ${recipient}`);
    console.log(`Subject:    ${subject}`);
    console.log(`Attachments: ${attachments.length > 0 ? attachments.map((a) => a.filename).join(", ") : "none"}`);
    console.log(`-----------------------------\n`);
    return "mock-success-id";
  }
}

/**
 * Handles the actual API request and retry scheduling loops.
 */
async function processEmail(logId, htmlContent, attachments = []) {
  // Fetch current log state
  const { data: log, error: fetchErr } = await supabase
    .from("email_logs")
    .select("*")
    .eq("id", logId)
    .single();

  if (fetchErr || !log) {
    console.error(`[EmailQueue] Could not load log with ID: ${logId}`);
    return;
  }

  try {
    // Attempt sending
    await processEmailDirect(log.id, log.recipient, log.subject, htmlContent, attachments);

    // Success: Update log to 'sent'
    await supabase
      .from("email_logs")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", log.id);

    console.log(`✉️ [EmailQueue] Email successfully sent to ${log.recipient} (${log.subject})`);
  } catch (sendErr) {
    console.error(`❌ [EmailQueue] Failed to send email to ${log.recipient}. Reason:`, sendErr.message);

    const nextRetryCount = (log.retry_count || 0) + 1;

    if (nextRetryCount <= 3) {
      // Schedule next retry delay: 30s (retry 1), 2m (retry 2), 10m (retry 3)
      const delay = nextRetryCount === 1 ? 30000 : nextRetryCount === 2 ? 120000 : 600000;

      await supabase
        .from("email_logs")
        .update({
          status: "retrying",
          retry_count: nextRetryCount,
          error_message: sendErr.message,
        })
        .eq("id", log.id);

      console.warn(`[EmailQueue] Scheduled retry #${nextRetryCount} for Log ID ${log.id} in ${delay / 1000}s`);

      setTimeout(() => {
        processEmail(log.id, htmlContent, attachments).catch(() => {});
      }, delay);
    } else {
      // Mark permanently failed
      await supabase
        .from("email_logs")
        .update({
          status: "failed",
          error_message: `Failed after 3 retries. Last error: ${sendErr.message}`,
        })
        .eq("id", log.id);

      console.error(`[EmailQueue] Max retries exceeded for Log ID ${log.id}. Marked as failed.`);
    }
  }
}

/**
 * Scans database for stuck emails on boot and resumes processing them.
 */
export async function initEmailQueue() {
  console.log("🔍 [EmailQueue] Checking for stuck or pending emails on server boot...");
  try {
    const { data: stuckLogs, error } = await supabase
      .from("email_logs")
      .select("*")
      .in("status", ["pending", "retrying"])
      .limit(100);

    if (error) {
      console.error("[EmailQueue] Failed to query stuck email logs:", error.message);
      return;
    }

    if (!stuckLogs || stuckLogs.length === 0) {
      console.log("[EmailQueue] No pending or stuck emails found.");
      return;
    }

    console.log(`[EmailQueue] Resuming processing for ${stuckLogs.length} pending/stuck email logs...`);

    for (const log of stuckLogs) {
      // Process immediately
      setImmediate(() => {
        processEmail(log.id, getHtmlBodyForTemplate(log.template, log.recipient), []).catch(() => {});
      });
    }
  } catch (err) {
    console.error("[EmailQueue] Boot queue recovery failed:", err.message);
  }
}

// ── 10 Responsive HTML Email Templates ──────────────────────────────────────────

/**
 * Helper to rebuild the body content for startup queue recovery when htmlContent is not in DB.
 */
function getHtmlBodyForTemplate(templateName, recipient) {
  // Return standard placeholder text if recovered on reboot.
  return getHtmlTemplate(
    "Notification Update",
    "Notification Update from NGO Panel",
    `<p>This is a recovered notification email regarding ${templateName} sent to ${recipient}. Please consult the NGO Admin Panel for details.</p>`
  );
}

// Email 1 – Volunteer Application Submitted
export async function sendVolunteerReceived(email, name) {
  const subject = "Volunteer Application Received";
  const body = `
    <h1 class="h1">Volunteer Application Received</h1>
    <div class="badge badge-pending">Received</div>
    <p>Dear ${name},</p>
    <p>Thank you for applying to become a volunteer with <strong>Uday Foundation Trust</strong>.</p>
    <p>We have successfully received your application.</p>
    <p>Our team will carefully review your application.</p>
    <p>You will receive another email once our review process is complete.</p>
    <p>Thank you for supporting our mission.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application received", body);
  await queueEmail(email, subject, html, "volunteer_received");
}

// Email 2 – Volunteer Approved
export async function sendVolunteerApproved(email, name) {
  const subject = "Congratulations! Your Volunteer Application Has Been Approved";
  const body = `
    <h1 class="h1">Volunteer Application Approved</h1>
    <div class="badge badge-approved">Approved</div>
    <p>Dear ${name},</p>
    <p>Congratulations!</p>
    <p>We are delighted to inform you that your volunteer application has been approved.</p>
    <p>We are excited to welcome you to the Uday Foundation Trust family.</p>
    <p>Our team will contact you shortly with further details.</p>
    <p>Thank you for joining us.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application approved", body);
  await queueEmail(email, subject, html, "volunteer_approved");
}

// Email 3 – Volunteer Rejected
export async function sendVolunteerRejected(email, name, reason) {
  const subject = "Volunteer Application Update";
  const cleanReason = reason ? `<div class="field-box"><strong>Feedback:</strong><br>${reason}</div>` : "";
  const body = `
    <h1 class="h1">Volunteer Application Update</h1>
    <div class="badge badge-rejected">Application Update</div>
    <p>Dear ${name},</p>
    <p>Thank you for your interest in volunteering with Uday Foundation Trust.</p>
    <p>After reviewing your application, we regret to inform you that we are unable to proceed at this time.</p>
    ${cleanReason}
    <p>We truly appreciate your willingness to serve the community.</p>
    <p>We encourage you to apply again in the future.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application update", body);
  await queueEmail(email, subject, html, "volunteer_rejected");
}

// Email 4 – Partnership Application Submitted
export async function sendPartnershipReceived(email, contactName, orgName) {
  const subject = "Partnership Application Received";
  const body = `
    <h1 class="h1">Partnership Application Received</h1>
    <div class="badge badge-pending">Received</div>
    <p>Dear ${contactName},</p>
    <p>Thank you for submitting a partnership application on behalf of <strong>${orgName}</strong> to Uday Foundation Trust.</p>
    <p>We have successfully received your proposal.</p>
    <p>Our collaboration committee is reviewing your details to ensure alignment with our trust objectives.</p>
    <p>We will reach out to you with updates shortly.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate(subject, "Partnership inquiry received", body);
  await queueEmail(email, subject, html, "partnership_received");
}

// Email 5 – Partnership Approved
export async function sendPartnershipApproved(email, contactName, orgName) {
  const subject = "Your Partnership Request Has Been Approved";
  const body = `
    <h1 class="h1">Partnership Request Approved</h1>
    <div class="badge badge-approved">Approved</div>
    <p>Dear ${contactName},</p>
    <p>Congratulations!</p>
    <p>We are pleased to inform you that the partnership request for <strong>${orgName}</strong> has been approved.</p>
    <p>Next steps: Our coordinator will contact you directly within 2 business days to schedule a kickoff discussion and draft our Memorandum of Collaboration.</p>
    <p>If you have any urgent queries, please email us at ${ADMIN_EMAIL}.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate(subject, "Partnership request approved", body);
  await queueEmail(email, subject, html, "partnership_approved");
}

// Email 6 – Partnership Rejected
export async function sendPartnershipRejected(email, contactName, orgName, reason) {
  const subject = "Partnership Application Update";
  const cleanReason = reason ? `<div class="field-box"><strong>Feedback:</strong><br>${reason}</div>` : "";
  const body = `
    <h1 class="h1">Partnership Application Update</h1>
    <div class="badge badge-rejected">Application Update</div>
    <p>Dear ${contactName},</p>
    <p>Thank you for your interest in collaborating with Uday Foundation Trust on behalf of <strong>${orgName}</strong>.</p>
    <p>After reviewing your request, we regret to inform you that we are unable to approve this partnership at this time.</p>
    ${cleanReason}
    <p>We appreciate your willingness to support community welfare initiatives and invite your team to collaborate in future projects.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate(subject, "Partnership request update", body);
  await queueEmail(email, subject, html, "partnership_rejected");
}

// Email 7 & 8 – Donation Successful & PDF Receipt Attachment
export async function sendDonationReceived(email, donorName, amount, txId, panNumber, receiptNumber, pdfBuffer) {
  const subject = "Thank You for Your Donation ❤️";
  const formattedAmount = Number(amount).toLocaleString("en-IN");
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const body = `
    <h1 class="h1">Thank You for Your Support!</h1>
    <div class="badge badge-approved">Receipt Generated</div>
    <p>Dear ${donorName},</p>
    <p>Thank you for supporting Uday Foundation Trust.</p>
    <p>Your generosity helps us continue our mission.</p>
    <p>Please find your official 80G tax donation receipt attached as a PDF file.</p>
    
    <div class="field-box">
      <div style="font-weight:bold; margin-bottom:12px; font-size:14px; color:#1e3a8a;">Donation Summary:</div>
      <div class="field-row">
        <span class="field-label">Donor Name:</span>
        <span class="field-value">${donorName}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Amount:</span>
        <span class="field-value">₹${formattedAmount}</span>
      </div>
      <div class="field-row">
        <span class="field-label">PAN Number:</span>
        <span class="field-value">${panNumber || "N/A"}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Receipt Number:</span>
        <span class="field-value">${receiptNumber}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Transaction ID:</span>
        <span class="field-value">${txId}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Date:</span>
        <span class="field-value">${dateStr}</span>
      </div>
    </div>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;

  const html = getHtmlTemplate(subject, "Thank you for your donation", body);
  const attachments = [];
  
  if (pdfBuffer) {
    const filename = `Donation_Receipt_${receiptNumber.replace(/\//g, "_")}.pdf`;
    attachments.push({
      filename,
      content: pdfBuffer,
    });
  }

  await queueEmail(email, subject, html, "donation_success", attachments);
}

// Email 9 – Donation Failed
export async function sendDonationFailed(email, donorName, amount) {
  const subject = "Donation Payment Failed";
  const formattedAmount = Number(amount).toLocaleString("en-IN");
  
  const body = `
    <h1 class="h1" style="color: #dc2626;">Donation Attempt Unsuccessful</h1>
    <div class="badge badge-rejected">Failed</div>
    <p>Dear ${donorName},</p>
    <p>We noticed that your attempt to donate <strong>₹${formattedAmount}</strong> to Uday Foundation Trust could not be processed.</p>
    <p>No funds were debited from your card or account. If any amount was debited temporarily, your bank will automatically refund it within 3-5 working days.</p>
    <p>We encourage you to try again or reach out to our team if you need assistance completing your transaction.</p>
    <p>Regards,<br>Uday Foundation Trust Team</p>
  `;
  const html = getHtmlTemplate(subject, "Donation payment failed", body);
  await queueEmail(email, subject, html, "donation_failed");
}

// Email 10 – Admin Notification Email
export async function sendAdminAlert(type, applicantName, details = {}) {
  const subject = `Alert: New ${type.toUpperCase()} Submission`;
  const fieldsHtml = Object.entries(details)
    .map(
      ([k, v]) => `
      <div class="field-row">
        <span class="field-label">${k}:</span>
        <span class="field-value">${v}</span>
      </div>
    `
    )
    .join("");

  const body = `
    <h1 class="h1">New Submission Alert</h1>
    <p>A new form has been submitted on the website by <strong>${applicantName}</strong>.</p>
    <div class="field-box">
      <div style="font-weight:bold; margin-bottom:12px; font-size:14px; color:#1e3a8a;">Submission Details [${type}]:</div>
      ${fieldsHtml}
    </div>
    <p>Please log in to the admin panel dashboard to review and manage this submission.</p>
  `;
  
  const html = getHtmlTemplate(subject, "New Submission Alert for Admin", body);
  await queueEmail(ADMIN_EMAIL, subject, html, "admin_notification");
}
