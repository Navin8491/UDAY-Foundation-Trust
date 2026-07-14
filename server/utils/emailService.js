import { Resend } from "resend";
import dotenv from "dotenv";
import { supabase } from "../config/db.js";

dotenv.config();

// Environment Variables binding with PRD specifications & legacy fallbacks
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || "Uday Foundation Trust";
// ADMIN_NOTIFICATION_EMAIL is the personal inbox (udayfts1024@gmail.com) — checked first
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "udayfts1024@gmail.com";

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
// ── HTML Responsive Template Wrapper ──────────────────────────────────────────
export function getHtmlTemplate(title, preheader, bodyContent, heroIcon = "🤝", heroTitle = "", heroBg = "#1e3a8a") {
  const currentYear = new Date().getFullYear();
  const displayTitle = heroTitle || title;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; }
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          table { border-collapse: collapse !important; }
          body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f9fc; }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          @media screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .content-card { padding: 24px !important; }
          }
        </style>
      </head>
      <body style="background-color: #f7f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; color: #334155;">
        <div style="display: none; font-size: 1px; color: #f7f9fc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
          ${preheader}
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="background-color: #f7f9fc; padding: 24px 16px 40px 16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width: 600px; text-align: left;">
                
                <!-- HEADER -->
                <tr>
                  <td align="center" style="padding: 16px 0 24px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" style="text-align: center;">
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <div style="display: inline-block; background-color: #1e3a8a; color: #ffffff; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; font-weight: 800; font-size: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center;">U</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #1e3a8a; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Uday Foundation Trust
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #7a9d1c; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding-top: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Service is Culture &bull; Service is True Dharma
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- HERO BANNER -->
                <tr>
                  <td style="background-color: ${heroBg}; padding: 36px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 12px; line-height: 1;">${heroIcon}</div>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.5px;">
                      ${displayTitle}
                    </h1>
                  </td>
                </tr>

                <!-- MAIN CARD -->
                <tr>
                  <td class="content-card" style="background-color: #ffffff; padding: 40px 32px; border-radius: 0 0 16px 16px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">
                    ${bodyContent}
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td align="center" style="padding: 40px 24px 16px 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; color: #64748b; font-size: 12px;">
                      <tr>
                        <td style="font-weight: 700; color: #1e3a8a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px;">
                          Uday Foundation Trust
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 10px; color: #94a3b8; text-transform: uppercase; padding-bottom: 16px;">
                          Registered NGO (Reg No: Guj/23016/Ahmedabad)
                        </td>
                      </tr>
                      <tr>
                        <td style="line-height: 1.6; padding-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b;">
                          314, Ambedkar Nagar, Soyla, Sanand, Ahmedabad, Gujarat &ndash; 382110<br/>
                          Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #1e3a8a; text-decoration: none; font-weight: 600;">${ADMIN_EMAIL}</a> &bull; Phone: +91 96246 68484
                        </td>
                      </tr>

                      <!-- SOCIAL BUTTONS -->
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                              <td style="padding: 0 4px;">
                                <a href="https://www.facebook.com/udayfoundationstrust" target="_blank" style="display: inline-block; background-color: #1877F2; color: #ffffff; font-size: 10px; font-weight: 700; text-decoration: none; padding: 6px 12px; border-radius: 9999px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Facebook</a>
                              </td>
                              <td style="padding: 0 4px;">
                                <a href="https://www.instagram.com/udayfoundationstrust" target="_blank" style="display: inline-block; background-color: #E4405F; color: #ffffff; font-size: 10px; font-weight: 700; text-decoration: none; padding: 6px 12px; border-radius: 9999px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Instagram</a>
                              </td>
                              <td style="padding: 0 4px;">
                                <a href="https://www.linkedin.com/company/uday-foundation-trust" target="_blank" style="display: inline-block; background-color: #0A66C2; color: #ffffff; font-size: 10px; font-weight: 700; text-decoration: none; padding: 6px 12px; border-radius: 9999px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">LinkedIn</a>
                              </td>
                              <td style="padding: 0 4px;">
                                <a href="https://www.youtube.com/@udayfoundationstrust" target="_blank" style="display: inline-block; background-color: #FF0000; color: #ffffff; font-size: 10px; font-weight: 700; text-decoration: none; padding: 6px 12px; border-radius: 9999px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">YouTube</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- LEGAL LINKS -->
                      <tr>
                        <td style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 10px; color: #94a3b8; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          <a href="https://www.udayfoundationstrust.org/privacy-policy" style="color: #64748b; text-decoration: none; margin: 0 4px;">Privacy Policy</a> &bull;
                          <a href="https://www.udayfoundationstrust.org/terms-and-conditions" style="color: #64748b; text-decoration: none; margin: 0 4px;">Terms & Conditions</a> &bull;
                          <a href="https://www.udayfoundationstrust.org/refund-policy" style="color: #64748b; text-decoration: none; margin: 0 4px;">Refund Policy</a> &bull;
                          <a href="https://www.udayfoundationstrust.org/disclaimer" style="color: #64748b; text-decoration: none; margin: 0 4px;">Disclaimer</a> &bull;
                          <a href="https://www.udayfoundationstrust.org/contact" style="color: #64748b; text-decoration: none; margin: 0 4px;">Contact</a>
                          <p style="margin-top: 16px; font-size: 9px; color: #cbd5e1;">&copy; ${currentYear} Uday Foundation Trust. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// Helper component to render key-value info rows
export function renderInfoRow(label, value) {
  return `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #64748b; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left;">${label}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #1e293b; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: right;">${value}</td>
    </tr>
  `;
}

// Helper component to wrap info rows in a table card
export function renderInfoCard(rowsHtml) {
  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 16px; margin: 24px 0 16px 0;">
      ${rowsHtml}
    </table>
  `;
}

// Helper component to render status badge
export function renderBadge(status) {
  let bg = "#ffedd5";
  let color = "#c2410c";
  const st = status.toLowerCase();
  if (st.includes("approved") || st.includes("success") || st.includes("received")) {
    bg = "#d1fae5";
    color = "#047857";
  } else if (st.includes("rejected") || st.includes("fail")) {
    bg = "#fee2e2";
    color = "#b91c1c";
  } else if (st.includes("complete") || st.includes("active") || st.includes("sent")) {
    bg = "#dbeafe";
    color = "#1d4ed8";
  }
  return `<span style="background-color: ${bg}; color: ${color}; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${status}</span>`;
}

// Helper component to render timeline widget
export function renderTimeline(currentStep) {
  const steps = ["Submitted", "Reviewing", "Approved", "Welcome"];
  let stepsHtml = "";
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const isCompleted = i <= currentStep;
    const isCurrent = i === currentStep;
    let color = "#94a3b8";
    if (isCurrent) {
      color = "#d97706"; // orange current
    } else if (isCompleted) {
      color = "#10b981"; // green completed
    }
    const weight = isCurrent || isCompleted ? "700" : "500";
    const line = i < steps.length - 1 
      ? `<td style="padding: 0 8px; font-size: 14px; color: #cbd5e1; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">&rarr;</td>` 
      : "";
    stepsHtml += `
      <td style="text-align: center; vertical-align: middle;">
        <span style="font-size: 10px; font-weight: ${weight}; color: ${color}; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${step}</span>
      </td>
      ${line}
    `;
  }
  return `
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 24px auto; max-width: 100%; border: 1px solid #f1f5f9; padding: 12px 16px; border-radius: 8px;">
      <tr>${stepsHtml}</tr>
    </table>
  `;
}

// Helper to render CTA button
export function renderButton(text, url) {
  return `
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0 8px 0; width: 100%;">
      <tr>
        <td align="left">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="border-radius: 9999px;" bgcolor="#1e3a8a">
                <a href="${url}" target="_blank" style="font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff; text-decoration: none; border-radius: 9999px; padding: 10px 24px; border: 1px solid #1e3a8a; display: inline-block; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">${text}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ── Email Logging & Background Processing Queue ────────────────────────────────

/**
 * Pushes an email into the database log and triggers background transmission.
 */
export async function queueEmail(recipient, subject, htmlContent, template, attachments = []) {
  try {
    // 1. Try to insert log record into PostgreSQL email_logs table
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
      // DB logging failed (e.g. email_logs table doesn't exist yet) — send directly
      console.warn("[EmailQueue] DB logging skipped, sending email directly:", error.message);
      try {
        await processEmailDirect(null, recipient, subject, htmlContent, attachments);
        console.log(`✉️ [EmailQueue] Email sent directly (no DB log) to ${recipient} (${template})`);
      } catch (sendErr) {
        console.error(`❌ [EmailQueue] Direct send failed to ${recipient}:`, sendErr.message);
      }
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
  let finalRecipient = recipient;
  let finalSubject = subject;

  // Sandbox Mode Override: Resend free tier (onboarding@resend.dev) only allows sending to the registered account owner.
  if (RESEND_FROM_EMAIL === "onboarding@resend.dev" && recipient.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    console.log(`[Resend Sandbox] Redirecting email for ${recipient} to registered admin: ${ADMIN_EMAIL}`);
    finalRecipient = ADMIN_EMAIL;
    finalSubject = `[Sandbox for ${recipient}] ${subject}`;
  }

  const fromHeader = `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`;

  if (resend) {
    const formattedAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.content.toString("base64"),
    }));

    const response = await resend.emails.send({
      from: fromHeader,
      to: finalRecipient,
      subject: finalSubject,
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
    console.log(`To:         ${finalRecipient}`);
    console.log(`Subject:    ${finalSubject}`);
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

// Helper to rebuild the body content for startup queue recovery when htmlContent is not in DB.
function getHtmlBodyForTemplate(templateName, recipient) {
  // Return standard placeholder text if recovered on reboot.
  return getHtmlTemplate(
    "Notification Update",
    "Notification Update from NGO Panel",
    `<p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello,</p>
     <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">This is a recovered notification email regarding <strong>${templateName}</strong> sent to ${recipient}. Please consult the NGO Admin Panel for details.</p>`,
    "🔔",
    "Notification Update",
    "#1e3a8a"
  );
}

// Email 1 – Volunteer Application Submitted
export async function sendVolunteerReceived(email, name) {
  const subject = "Volunteer Application Received";
  const rows = 
    renderInfoRow("Applicant", name) +
    renderInfoRow("Email", email) +
    renderInfoRow("Role", "Volunteer") +
    renderInfoRow("Applied On", new Date().toLocaleDateString("en-IN")) +
    renderInfoRow("Status", renderBadge("Received"));
    
  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for applying to become a volunteer with <strong>Uday Foundation Trust</strong>. We have received your application successfully!</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Our team will carefully review your details to ensure alignment with our trust objectives. You will receive another email once our review process is complete.</p>
    
    ${renderTimeline(0)}
    ${renderInfoCard(rows)}
    
    <p style="font-size: 13px; color: #64748b; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px;">Thank you for your willingness to support our mission and serve the community.</p>
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application received", body, "🤝", "Application Received", "#1e3a8a");
  await queueEmail(email, subject, html, "volunteer_received");
}

// Email 2 – Volunteer Approved
export async function sendVolunteerApproved(email, name) {
  const subject = "Congratulations! Your Volunteer Application Has Been Approved";
  const rows = 
    renderInfoRow("Volunteer", name) +
    renderInfoRow("Email", email) +
    renderInfoRow("Status", renderBadge("Approved"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Congratulations! We are absolutely delighted to inform you that your volunteer application has been approved.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We are thrilled to welcome you to the Uday Foundation Trust family. Our coordinator will contact you directly within 2 business days to share details about upcoming community programs and onboarding steps.</p>
    
    ${renderTimeline(2)}
    ${renderInfoCard(rows)}

    <h3 style="font-size: 14px; color: #1e3a8a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 24px 0 12px 0;">Next Steps</h3>
    <ul style="font-size: 13px; color: #475569; line-height: 1.6; padding-left: 20px; margin: 0 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <li style="margin-bottom: 8px;">Check your phone/email for coordinator updates.</li>
      <li style="margin-bottom: 8px;">Review our current initiative objectives on our website.</li>
      <li style="margin-bottom: 8px;">Get ready to make a meaningful difference!</li>
    </ul>

    ${renderButton("Visit Our Website", "https://www.udayfoundationstrust.org")}
    
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application approved", body, "🎉", "Welcome Aboard!", "#10b981");
  await queueEmail(email, subject, html, "volunteer_approved");
}

// Email 3 – Volunteer Rejected
export async function sendVolunteerRejected(email, name, reason) {
  const subject = "Volunteer Application Update";
  const feedbackHtml = reason 
    ? `<div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; color: #b45309; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
         <strong>Feedback:</strong><br/>
         "${reason}"
       </div>`
    : "";

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for your interest in volunteering with Uday Foundation Trust.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">After reviewing your details, we regret to inform you that we are unable to proceed with your application at this time.</p>
    
    ${feedbackHtml}
    
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We sincerely appreciate your willingness to serve the community. We will keep your information on file and encourage you to apply again in the future as new opportunities arise.</p>
    
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application update", body, "📄", "Application Update", "#ef4444");
  await queueEmail(email, subject, html, "volunteer_rejected");
}

// Email 4 – Partnership Application Submitted
export async function sendPartnershipReceived(email, contactName, orgName) {
  const subject = "Partnership Application Received";
  const rows = 
    renderInfoRow("Organization", orgName) +
    renderInfoRow("Contact Person", contactName) +
    renderInfoRow("Email", email) +
    renderInfoRow("Status", renderBadge("Received"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${contactName},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for submitting a partnership application on behalf of <strong>${orgName}</strong> to Uday Foundation Trust.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Our collaboration committee is reviewing your details to ensure alignment with our trust objectives. We will reach out to you with updates shortly.</p>
    
    ${renderInfoCard(rows)}
    
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Partnership inquiry received", body, "🏢", "Partnership Received", "#1e3a8a");
  await queueEmail(email, subject, html, "partnership_received");
}

// Email 5 – Partnership Approved
export async function sendPartnershipApproved(email, contactName, orgName) {
  const subject = "Your Partnership Request Has Been Approved";
  const rows = 
    renderInfoRow("Organization", orgName) +
    renderInfoRow("Contact Person", contactName) +
    renderInfoRow("Status", renderBadge("Approved"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${contactName},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Congratulations! We are pleased to inform you that the partnership request for <strong>${orgName}</strong> has been approved.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><strong>Next steps:</strong> Our coordinator will contact you directly within 2 business days to schedule a kickoff discussion and draft our Memorandum of Collaboration.</p>
    
    ${renderInfoCard(rows)}

    ${renderButton("Contact Support", "https://www.udayfoundationstrust.org/contact")}
    
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Partnership request approved", body, "🎉", "Partnership Approved", "#10b981");
  await queueEmail(email, subject, html, "partnership_approved");
}

// Email 6 – Partnership Rejected
export async function sendPartnershipRejected(email, contactName, orgName, reason) {
  const subject = "Partnership Application Update";
  const feedbackHtml = reason 
    ? `<div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; color: #b45309; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
         <strong>Feedback:</strong><br/>
         "${reason}"
       </div>`
    : "";

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${contactName},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for your interest in collaborating with Uday Foundation Trust on behalf of <strong>${orgName}</strong>.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">After reviewing your request, we regret to inform you that we are unable to approve this partnership at this time.</p>
    
    ${feedbackHtml}
    
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We appreciate your team's willingness to support community welfare initiatives and invite you to collaborate in future projects.</p>
    
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Partnership request update", body, "📄", "Partnership Update", "#ef4444");
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

  const rows = 
    renderInfoRow("Donor Name", donorName) +
    renderInfoRow("Amount", `₹${formattedAmount}`) +
    renderInfoRow("PAN Number", panNumber || "N/A") +
    renderInfoRow("Receipt Number", receiptNumber) +
    renderInfoRow("Transaction ID", txId) +
    renderInfoRow("Date", dateStr) +
    renderInfoRow("Status", renderBadge("Successful"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${donorName},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for supporting Uday Foundation Trust! Your generosity helps us continue our mission to serve the underprivileged.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Please find your official 80G tax donation receipt attached to this email as a PDF file.</p>
    
    ${renderInfoCard(rows)}
    
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;

  const html = getHtmlTemplate(subject, "Thank you for your donation", body, "❤️", "Donation Received", "#10b981");
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
  
  const rows = 
    renderInfoRow("Donor Name", donorName) +
    renderInfoRow("Attempted Amount", `₹${formattedAmount}`) +
    renderInfoRow("Status", renderBadge("Failed"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${donorName},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We noticed that your attempt to donate <strong>₹${formattedAmount}</strong> to Uday Foundation Trust could not be completed.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">No funds were debited from your account. If any amount was debited temporarily, your bank will automatically refund it within 3-5 working days.</p>
    
    ${renderInfoCard(rows)}
    
    <p style="font-size: 13px; color: #64748b; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We encourage you to try again or reach out to our team if you need assistance completing your transaction.</p>
    
    ${renderButton("Contact Support", "https://www.udayfoundationstrust.org/contact")}

    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Donation payment failed", body, "🧾", "Payment Unsuccessful", "#ef4444");
  await queueEmail(email, subject, html, "donation_failed");
}

// Email 10 – Admin Notification Email
export async function sendAdminAlert(type, applicantName, details = {}) {
  const subject = `Alert: New ${type.toUpperCase()} Submission`;
  const fieldsHtml = Object.entries(details)
    .map(([k, v]) => renderInfoRow(k, String(v)))
    .join("");

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello Admin,</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A new form submission of type <strong>${type.toUpperCase()}</strong> has been completed by <strong>${applicantName}</strong> on the website.</p>
    
    ${renderInfoCard(fieldsHtml)}
    
    ${renderButton("Open NGO Admin Panel", "https://www.udayfoundationstrust.org/admin")}
    
    <p style="font-size: 12px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated system alert. Do not reply to this email.</p>
  `;
  
  const html = getHtmlTemplate(subject, "New Submission Alert for Admin", body, "🔔", "Admin System Alert", "#1e3a8a");
  await queueEmail(ADMIN_EMAIL, subject, html, "admin_notification");
}

export async function sendAdminDonationAlert(donation, event, pdfBuffer) {
  const amount = donation.amount || event.amount;
  const formattedAmount = Number(amount).toLocaleString("en-IN");
  const subject = `New Donation Received – ₹${formattedAmount}`;
  
  const paymentTimeStr = event.updated_at 
    ? new Date(event.updated_at).toLocaleString("en-IN")
    : new Date().toLocaleString("en-IN");

  const rows = 
    renderInfoRow("Donor Name", donation.donorName || event.donor_name) +
    renderInfoRow("Email Address", donation.email || event.email) +
    renderInfoRow("Phone Number", donation.phone || event.phone || "N/A") +
    renderInfoRow("PAN Number", donation.panNumber || event.pan_number || "N/A") +
    renderInfoRow("Address", donation.address || event.address || "N/A") +
    renderInfoRow("Donation Amount", `₹${formattedAmount}`) +
    renderInfoRow("Transaction ID", event.id) +
    renderInfoRow("Order ID", event.idempotency_key) +
    renderInfoRow("Cashfree Payment ID", event.gateway_transaction_id || "N/A") +
    renderInfoRow("Payment Method", event.payment_method || "Online Gateway") +
    renderInfoRow("Payment Time", paymentTimeStr) +
    renderInfoRow("Receipt Number", donation.receiptNumber) +
    renderInfoRow("Donation Purpose", donation.purpose || event.purpose || "General Donation") +
    renderInfoRow("Payment Status", renderBadge("Successful"));

  const adminBaseUrl = process.env.ADMIN_URL || "https://uday-foundation-trust.onrender.com/admin";
  const viewDonationUrl = `${adminBaseUrl}/donations?search=${donation.id}`;
  const downloadReceiptUrl = `${process.env.NEXT_PUBLIC_API_URL || "https://uday-foundation-trust.onrender.com/api"}/payments/receipt/${donation.id}`;

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello Admin,</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A new donation has been successfully processed on the website. Here are the transaction and donor details:</p>
    
    ${renderInfoCard(rows)}
    
    <p style="margin-top: 24px; text-align: center;">
      <a href="${downloadReceiptUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; font-weight: bold; text-decoration: none; border-radius: 8px; margin-right: 12px; font-size: 13px;">Download Receipt</a>
      <a href="${viewDonationUrl}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 10px 20px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 13px;">View Donation in Admin Panel</a>
    </p>
    
    <p style="font-size: 12px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated system alert. Do not reply to this email.</p>
  `;

  const html = getHtmlTemplate(subject, `New Donation Alert – ₹${formattedAmount}`, body, "🎉", "Admin Donation Alert", "#1e3a8a");
  const attachments = [];
  
  if (pdfBuffer) {
    const filename = `Donation_Receipt_${donation.receiptNumber.replace(/\//g, "_")}.pdf`;
    attachments.push({
      filename,
      content: pdfBuffer,
    });
  }

  await queueEmail(ADMIN_EMAIL, subject, html, "admin_donation_alert", attachments);
}

export async function sendVolunteerUpdated(email, name, applicationId, updatedStatus, changedFields, adminNotes) {
  const subject = "Your Volunteer Application Has Been Updated";
  
  const fieldsHtml = changedFields.map(f => `
    <div style="border-bottom: 1px solid #f1f5f9; padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <span style="font-weight: 700; color: #475569; text-transform: capitalize; font-size: 13px;">${f.field.replace(/([A-Z])/g, ' $1')}:</span>
      <div style="margin-top: 4px; display: flex; gap: 8px; font-size: 12px;">
        <span style="color: #ef4444; text-decoration: line-through;">${f.oldValue}</span>
        <span style="color: #64748b;">&rarr;</span>
        <span style="color: #10b981; font-weight: 600;">${f.newValue}</span>
      </div>
    </div>
  `).join("");

  const notesHtml = adminNotes 
    ? `<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; color: #334155; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
         <strong>Admin Notes:</strong><br/>
         "${adminNotes}"
       </div>`
    : "";

  const rows = 
    renderInfoRow("Volunteer Name", name) +
    renderInfoRow("Application ID", applicationId) +
    renderInfoRow("Current Status", renderBadge(updatedStatus)) +
    renderInfoRow("Update Time", new Date().toLocaleString("en-IN"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Your volunteer application profile details have been updated by the administrator. Here are the updated details:</p>
    
    ${renderInfoCard(rows)}
    
    <h3 style="font-size: 14px; color: #1e3a8a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 24px 0 12px 0;">Changed Fields</h3>
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 16px; margin-bottom: 24px;">
      ${fieldsHtml}
    </div>

    ${notesHtml}
    
    <p style="font-size: 13px; color: #64748b; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px;">If you have any questions or did not authorize these changes, please reply to this email or contact us at <a href="mailto:support@udayfoundationstrust.org" style="color: #1e3a8a; text-decoration: underline;">support@udayfoundationstrust.org</a>.</p>
    
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application updated", body, "📝", "Profile Updated", "#1e3a8a");
  await queueEmail(email, subject, html, "volunteer_updated");
}

export async function sendVolunteerReopened(email, name, applicationId) {
  const subject = "Your Volunteer Application Has Been Reopened";
  const rows = 
    renderInfoRow("Volunteer Name", name) +
    renderInfoRow("Application ID", applicationId) +
    renderInfoRow("Status", renderBadge("Pending Review")) +
    renderInfoRow("Action Date", new Date().toLocaleString("en-IN"));

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Your volunteer application with Uday Foundation Trust has been reopened by the administrator for further evaluation.</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We will review your profile again shortly. Our coordinator will contact you directly if any additional details or documents are required.</p>
    
    ${renderInfoCard(rows)}
    
    <p style="font-size: 13px; color: #64748b; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px;">Thank you for your patience and support.</p>
    <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
  `;
  const html = getHtmlTemplate(subject, "Volunteer application reopened", body, "♻️", "Application Reopened", "#eab308");
  await queueEmail(email, subject, html, "volunteer_reopened");
}

// ── Personal Email Notification Handlers (PRD Requirements) ──────────────────

export async function sendPersonalVolunteerNotification(volunteer) {
  const personalEmail = process.env.PERSONAL_NOTIFICATION_EMAIL || "udayfts1024@gmail.com";
  const subject = `🆕 New Volunteer Application Received – ${volunteer.name}`;
  
  const createdTime = volunteer.created_at 
    ? new Date(volunteer.created_at).toLocaleString("en-IN")
    : new Date().toLocaleString("en-IN");

  const rows = 
    renderInfoRow("Applicant Name", volunteer.name) +
    renderInfoRow("Email Address", volunteer.email) +
    renderInfoRow("Phone Number", volunteer.phone) +
    renderInfoRow("Date of Birth", volunteer.dob || "Not Provided") +
    renderInfoRow("Gender", volunteer.gender || "Not Provided") +
    renderInfoRow("Occupation", volunteer.occupation || "Not Provided") +
    renderInfoRow("Qualification", volunteer.education || "Not Provided") +
    renderInfoRow("Languages", volunteer.languages || "Not Provided") +
    renderInfoRow("Skills", volunteer.skills || "Not Provided") +
    renderInfoRow("Experience", volunteer.experience || "Not Provided") +
    renderInfoRow("Address", volunteer.address || "Not Provided") +
    renderInfoRow("City", volunteer.city || "Not Provided") +
    renderInfoRow("State", volunteer.state || "Not Provided") +
    renderInfoRow("Country", volunteer.country || "Not Provided") +
    renderInfoRow("Application ID", volunteer.id) +
    renderInfoRow("Submission Time", createdTime) +
    renderInfoRow("Current Status", renderBadge(volunteer.status || "pending"));

  const adminBaseUrl = process.env.ADMIN_URL || "https://uday-foundation-trust.onrender.com/admin";
  const viewUrl = `${adminBaseUrl}/volunteers`;

  let buttonsHtml = `
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0 8px 0; width: 100%;">
      <tr>
        <td align="left">
          <a href="${viewUrl}" target="_blank" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 10px 18px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 12px; margin-right: 10px;">View in Admin Panel</a>
  `;

  if (volunteer.resumeUrl) {
    buttonsHtml += `<a href="${volunteer.resumeUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 18px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 12px; margin-right: 10px;">Download Resume</a>`;
  }
  if (volunteer.idProofUrl) {
    buttonsHtml += `<a href="${volunteer.idProofUrl}" target="_blank" style="display: inline-block; background-color: #f59e0b; color: white; padding: 10px 18px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 12px;">Download ID Proof</a>`;
  }

  buttonsHtml += `
        </td>
      </tr>
    </table>
  `;

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello,</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A new volunteer application has been submitted on the website. Here are the applicant details:</p>
    
    ${renderInfoCard(rows)}
    
    ${buttonsHtml}
    
    <p style="font-size: 12px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated personal notification alert.</p>
  `;

  const html = getHtmlTemplate(subject, `New Volunteer application received – ${volunteer.name}`, body, "🆕", "Volunteer Submission", "#1e3a8a");
  await queueEmail(personalEmail, subject, html, "personal_volunteer_notification");
}

export async function sendPersonalPartnershipNotification(partnership) {
  const personalEmail = process.env.PERSONAL_NOTIFICATION_EMAIL || "udayfts1024@gmail.com";
  const subject = `🤝 New Partnership Application Received – ${partnership.orgName}`;
  
  const createdTime = partnership.created_at 
    ? new Date(partnership.created_at).toLocaleString("en-IN")
    : new Date().toLocaleString("en-IN");

  let proposalDesc = "Not Provided";
  let websiteUrl = "Not Provided";
  let physicalAddress = "Not Provided";

  if (partnership.message) {
    try {
      const parsed = JSON.parse(partnership.message);
      if (parsed && typeof parsed === "object" && parsed.isExtended) {
        proposalDesc = parsed.proposal || proposalDesc;
        websiteUrl = parsed.website || websiteUrl;
        physicalAddress = parsed.address || physicalAddress;
      } else {
        proposalDesc = partnership.message;
      }
    } catch (e) {
      proposalDesc = partnership.message;
    }
  }

  const rows = 
    renderInfoRow("Organization Name", partnership.orgName) +
    renderInfoRow("Contact Person", partnership.contactName) +
    renderInfoRow("Email Address", partnership.email) +
    renderInfoRow("Phone Number", partnership.phone) +
    renderInfoRow("Partnership Type", partnership.type) +
    renderInfoRow("Description", proposalDesc) +
    renderInfoRow("Website", websiteUrl) +
    renderInfoRow("Address", physicalAddress) +
    renderInfoRow("Application ID", partnership.id) +
    renderInfoRow("Submission Time", createdTime) +
    renderInfoRow("Current Status", renderBadge(partnership.status || "pending"));

  const adminBaseUrl = process.env.ADMIN_URL || "https://uday-foundation-trust.onrender.com/admin";
  const viewUrl = `${adminBaseUrl}/partnerships`;

  let buttonsHtml = `
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0 8px 0; width: 100%;">
      <tr>
        <td align="left">
          <a href="${viewUrl}" target="_blank" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 10px 18px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 12px; margin-right: 10px;">View in Admin Panel</a>
  `;

  if (partnership.documentUrl) {
    buttonsHtml += `<a href="${partnership.documentUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 18px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 12px;">Download Document</a>`;
  }

  buttonsHtml += `
        </td>
      </tr>
    </table>
  `;

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello,</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A new partnership application has been submitted on the website. Here are the organization details:</p>
    
    ${renderInfoCard(rows)}
    
    ${buttonsHtml}
    
    <p style="font-size: 12px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated personal notification alert.</p>
  `;

  const html = getHtmlTemplate(subject, `New Partnership application received – ${partnership.orgName}`, body, "🤝", "Partnership Submission", "#1e3a8a");
  await queueEmail(personalEmail, subject, html, "personal_partnership_notification");
}

export async function sendPersonalDonationNotification(donation, event, pdfBuffer) {
  const personalEmail = process.env.PERSONAL_NOTIFICATION_EMAIL || "udayfts1024@gmail.com";
  const amount = donation.amount || event.amount;
  const formattedAmount = Number(amount).toLocaleString("en-IN");
  const subject = `💚 New Donation Received – ₹${formattedAmount} from ${donation.donorName || event.donor_name}`;
  
  const paymentTimeStr = event.updated_at 
    ? new Date(event.updated_at).toLocaleString("en-IN")
    : new Date().toLocaleString("en-IN");

  const rows = 
    renderInfoRow("Donor Name", donation.donorName || event.donor_name) +
    renderInfoRow("Email Address", donation.email || event.email) +
    renderInfoRow("Phone Number", donation.phone || event.phone || "N/A") +
    renderInfoRow("PAN Number", donation.panNumber || event.pan_number || "N/A") +
    renderInfoRow("Donation Amount", `₹${formattedAmount}`) +
    renderInfoRow("Currency", event.currency || "INR") +
    renderInfoRow("Transaction ID", event.id) +
    renderInfoRow("Cashfree Order ID", event.idempotency_key) +
    renderInfoRow("Cashfree Payment ID", event.gateway_transaction_id || "N/A") +
    renderInfoRow("Payment Method", event.payment_method || "Online Gateway") +
    renderInfoRow("Payment Time", paymentTimeStr) +
    renderInfoRow("Receipt Number", donation.receiptNumber) +
    renderInfoRow("Donation Purpose", donation.purpose || event.purpose || "General Donation") +
    renderInfoRow("Payment Status", renderBadge("Successful"));

  const adminBaseUrl = process.env.ADMIN_URL || "https://uday-foundation-trust.onrender.com/admin";
  const viewUrl = `${adminBaseUrl}/donations?search=${donation.id}`;
  const downloadReceiptUrl = `${process.env.NEXT_PUBLIC_API_URL || "https://uday-foundation-trust.onrender.com/api"}/payments/receipt/${donation.id}`;

  const body = `
    <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello,</p>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A new donation has been successfully completed and verified. Here are the transaction details:</p>
    
    ${renderInfoCard(rows)}
    
    <p style="margin-top: 24px; text-align: center;">
      <a href="${downloadReceiptUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; font-weight: bold; text-decoration: none; border-radius: 8px; margin-right: 12px; font-size: 13px;">Download Receipt</a>
      <a href="${viewUrl}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 10px 20px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 13px;">View Donation in Admin Panel</a>
    </p>
    
    <p style="font-size: 12px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated personal notification alert.</p>
  `;

  const html = getHtmlTemplate(subject, `New Donation Alert – ₹${formattedAmount}`, body, "💚", "Donation Successful", "#10b981");
  const attachments = [];
  
  if (pdfBuffer) {
    const filename = `Donation_Receipt_${donation.receiptNumber.replace(/\//g, "_")}.pdf`;
    attachments.push({
      filename,
      content: pdfBuffer,
    });
  }

  await queueEmail(personalEmail, subject, html, "personal_donation_notification", attachments);
}



