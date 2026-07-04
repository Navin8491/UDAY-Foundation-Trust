import { supabase } from "../config/db.js";

// Rebuild helper for retries / recovery lookup
async function getRebuiltHtml(templateName, recipient) {
  // Default fallback text
  let body = `<p>This is a notification update regarding your submission for ${templateName}. Please log in to your NGO panel for details.</p>`;
  let title = "Notification Update";

  try {
    if (templateName.startsWith("volunteer_")) {
      // Lookup volunteer by email
      const { data: vol } = await supabase
        .from("volunteers")
        .select("name")
        .eq("email", recipient)
        .limit(1)
        .maybeSingle();
      const name = vol?.name || "Volunteer";

      if (templateName === "volunteer_received") {
        title = "Volunteer Application Received";
        body = `
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
      } else if (templateName === "volunteer_approved") {
        title = "Congratulations! Your Volunteer Application Has Been Approved";
        body = `
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
      } else if (templateName === "volunteer_rejected") {
        title = "Volunteer Application Update";
        body = `
          <h1 class="h1">Volunteer Application Update</h1>
          <div class="badge badge-rejected">Application Update</div>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in volunteering with Uday Foundation Trust.</p>
          <p>After reviewing your application, we regret to inform you that we are unable to proceed at this time.</p>
          <p>We truly appreciate your willingness to serve the community.</p>
          <p>We encourage you to apply again in the future.</p>
          <p>Regards,<br>Uday Foundation Trust Team</p>
        `;
      }
    } else if (templateName.startsWith("partnership_")) {
      // Lookup partnership by email
      const { data: part } = await supabase
        .from("partnerships")
        .select("contactName, orgName")
        .eq("email", recipient)
        .limit(1)
        .maybeSingle();
      const contactName = part?.contactName || "Representative";
      const orgName = part?.orgName || "Organization";

      if (templateName === "partnership_received") {
        title = "Partnership Application Received";
        body = `
          <h1 class="h1">Partnership Application Received</h1>
          <div class="badge badge-pending">Received</div>
          <p>Dear ${contactName},</p>
          <p>Thank you for submitting a partnership application on behalf of <strong>${orgName}</strong> to Uday Foundation Trust.</p>
          <p>We have successfully received your proposal.</p>
          <p>Our collaboration committee is reviewing your details to ensure alignment with our trust objectives.</p>
          <p>We will reach out to you with updates shortly.</p>
          <p>Regards,<br>Uday Foundation Trust Team</p>
        `;
      } else if (templateName === "partnership_approved") {
        title = "Your Partnership Request Has Been Approved";
        body = `
          <h1 class="h1">Partnership Request Approved</h1>
          <div class="badge badge-approved">Approved</div>
          <p>Dear ${contactName},</p>
          <p>Congratulations!</p>
          <p>We are pleased to inform you that the partnership request for <strong>${orgName}</strong> has been approved.</p>
          <p>Next steps: Our coordinator will contact you directly within 2 business days to schedule a kickoff discussion and draft our Memorandum of Collaboration.</p>
          <p>Regards,<br>Uday Foundation Trust Team</p>
        `;
      } else if (templateName === "partnership_rejected") {
        title = "Partnership Application Update";
        body = `
          <h1 class="h1">Partnership Application Update</h1>
          <div class="badge badge-rejected">Application Update</div>
          <p>Dear ${contactName},</p>
          <p>Thank you for your interest in collaborating with Uday Foundation Trust on behalf of <strong>${orgName}</strong>.</p>
          <p>After reviewing your request, we regret to inform you that we are unable to approve this partnership at this time.</p>
          <p>We appreciate your willingness to support community welfare initiatives and invite your team to collaborate in future projects.</p>
          <p>Regards,<br>Uday Foundation Trust Team</p>
        `;
      }
    } else if (templateName.startsWith("donation_")) {
      // Lookup donation by email
      const { data: don } = await supabase
        .from("donations")
        .select("donorName, amount, receiptNumber, panNumber")
        .eq("email", recipient)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const donorName = don?.donorName || "Donor";
      const amount = don?.amount || 0;
      const formattedAmount = Number(amount).toLocaleString("en-IN");
      const receiptNumber = don?.receiptNumber || "Direct";
      const panNumber = don?.panNumber || "N/A";

      if (templateName === "donation_success") {
        title = "Thank You for Your Donation ❤️";
        body = `
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
              <span class="field-value">${panNumber}</span>
            </div>
            <div class="field-row">
              <span class="field-label">Receipt Number:</span>
              <span class="field-value">${receiptNumber}</span>
            </div>
          </div>
          <p>Regards,<br>Uday Foundation Trust Team</p>
        `;
      } else if (templateName === "donation_failed") {
        title = "Donation Payment Failed";
        body = `
          <h1 class="h1" style="color: #dc2626;">Donation Attempt Unsuccessful</h1>
          <div class="badge badge-rejected">Failed</div>
          <p>Dear ${donorName},</p>
          <p>We noticed that your attempt to donate <strong>₹${formattedAmount}</strong> to Uday Foundation Trust could not be processed.</p>
          <p>No funds were debited from your card or account. If any amount was debited temporarily, your bank will automatically refund it within 3-5 working days.</p>
          <p>We encourage you to try again or reach out to our team if you need assistance completing your transaction.</p>
          <p>Regards,<br>Uday Foundation Trust Team</p>
        `;
      }
    }
  } catch (lookupErr) {
    console.warn("[EmailController] Lookups failed during rebuild:", lookupErr.message);
  }

  // Inject into default responsive wrapper
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || "udayfts1024@gmail.com";
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
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
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
          }
          .content {
            padding: 40px;
            line-height: 1.6;
          }
          .badge {
            display: inline-block;
            padding: 6px 16px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 9999px;
          }
          .badge-approved { background-color: #d1fae5; color: #065f46; }
          .badge-pending { background-color: #fef3c7; color: #92400e; }
          .badge-rejected { background-color: #fee2e2; color: #991b1b; }
          .footer {
            background-color: #f1f5f9;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-text">UDAY FOUNDATION TRUST</div>
          </div>
          <div class="content">${body}</div>
          <div class="footer">
            <p>Uday Foundation Trust, Sanand, Ahmedabad, Gujarat</p>
            <p>Registered NGO | Email: ${ADMIN_EMAIL}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function getEmailStats(req, res, next) {
  try {
    const { data: logs, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const totalSent = logs.filter((l) => l.status === "sent").length;
    const failedCount = logs.filter((l) => l.status === "failed").length;
    const pendingCount = logs.filter((l) => l.status === "pending").length;
    const retryingCount = logs.filter((l) => l.status === "retrying").length;

    // Get the actual queue logs (either pending or retrying)
    const retryQueue = logs.filter((l) => ["pending", "retrying"].includes(l.status));

    res.json({
      totalSent,
      failedCount,
      pendingCount,
      retryingCount,
      retryQueue,
      logs: logs.slice(0, 50), // Send last 50 logs to display
    });
  } catch (err) {
    next(err);
  }
}

export async function retryEmailLogs(req, res, next) {
  try {
    const { id } = req.params;
    const { data: log, error } = await supabase
      .from("email_logs")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !log) {
      res.status(404);
      return next(new Error("Email log record not found"));
    }

    // Update status back to pending and reset retry count in DB
    const { data: updated, error: updateErr } = await supabase
      .from("email_logs")
      .update({
        status: "pending",
        retry_count: 0,
        error_message: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // Trigger process email directly and asynchronously
    const { queueEmail } = await import("../utils/emailService.js");
    const htmlBody = await getRebuiltHtml(log.template, log.recipient);
    
    // Call queueEmail to re-insert / handle it safely
    queueEmail(log.recipient, log.subject, htmlBody, log.template).catch((err) => {
      console.error("[EmailController] Failed to retry email:", err.message);
    });

    res.json({ message: "Retry triggered successfully", log: updated });
  } catch (err) {
    next(err);
  }
}
