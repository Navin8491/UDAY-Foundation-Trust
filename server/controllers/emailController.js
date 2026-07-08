import { supabase } from "../config/db.js";
import { 
  getHtmlTemplate, 
  renderInfoRow, 
  renderInfoCard, 
  renderBadge, 
  renderTimeline, 
  renderButton 
} from "../utils/emailService.js";

// Rebuild helper for retries / recovery lookup
async function getRebuiltHtml(templateName, recipient) {
  // Default fallback text
  let body = `<p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: sans-serif;">This is a notification update regarding your submission for ${templateName}. Please log in to your NGO panel for details.</p>`;
  let title = "Notification Update";
  let heroIcon = "🔔";
  let heroTitle = "Notification Update";
  let heroBg = "#1e3a8a";

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
        heroTitle = "Application Received";
        heroIcon = "🤝";
        heroBg = "#1e3a8a";
        const rows = 
          renderInfoRow("Applicant", name) +
          renderInfoRow("Email", recipient) +
          renderInfoRow("Role", "Volunteer") +
          renderInfoRow("Applied On", new Date().toLocaleDateString("en-IN")) +
          renderInfoRow("Status", renderBadge("Received"));
        body = `
          <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for applying to become a volunteer with <strong>Uday Foundation Trust</strong>. We have received your application successfully!</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Our team will carefully review your details to ensure alignment with our trust objectives. You will receive another email once our review process is complete.</p>
          
          ${renderTimeline(0)}
          ${renderInfoCard(rows)}
          
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px;">Thank you for your willingness to support our mission and serve the community.</p>
          <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
        `;
      } else if (templateName === "volunteer_approved") {
        title = "Congratulations! Your Volunteer Application Has Been Approved";
        heroTitle = "Welcome Aboard!";
        heroIcon = "🎉";
        heroBg = "#10b981";
        const rows = 
          renderInfoRow("Volunteer", name) +
          renderInfoRow("Email", recipient) +
          renderInfoRow("Status", renderBadge("Approved"));
        body = `
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
      } else if (templateName === "volunteer_rejected") {
        title = "Volunteer Application Update";
        heroTitle = "Application Update";
        heroIcon = "📄";
        heroBg = "#ef4444";
        body = `
          <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for your interest in volunteering with Uday Foundation Trust.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">After reviewing your details, we regret to inform you that we are unable to proceed with your application at this time.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We sincerely appreciate your willingness to serve the community. We will keep your information on file and encourage you to apply again in the future as new opportunities arise.</p>
          
          <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
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
        heroTitle = "Partnership Received";
        heroIcon = "🏢";
        heroBg = "#1e3a8a";
        const rows = 
          renderInfoRow("Organization", orgName) +
          renderInfoRow("Contact Person", contactName) +
          renderInfoRow("Email", recipient) +
          renderInfoRow("Status", renderBadge("Received"));
        body = `
          <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${contactName},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for submitting a partnership application on behalf of <strong>${orgName}</strong> to Uday Foundation Trust.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Our collaboration committee is reviewing your details to ensure alignment with our trust objectives. We will reach out to you with updates shortly.</p>
          
          ${renderInfoCard(rows)}
          
          <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
        `;
      } else if (templateName === "partnership_approved") {
        title = "Your Partnership Request Has Been Approved";
        heroTitle = "Partnership Approved";
        heroIcon = "🎉";
        heroBg = "#10b981";
        const rows = 
          renderInfoRow("Organization", orgName) +
          renderInfoRow("Contact Person", contactName) +
          renderInfoRow("Status", renderBadge("Approved"));
        body = `
          <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${contactName},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Congratulations! We are pleased to inform you that the partnership request for <strong>${orgName}</strong> has been approved.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><strong>Next steps:</strong> Our coordinator will contact you directly within 2 business days to schedule a kickoff discussion and draft our Memorandum of Collaboration.</p>
          
          ${renderInfoCard(rows)}

          ${renderButton("Contact Support", "https://www.udayfoundationstrust.org/contact")}
          
          <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
        `;
      } else if (templateName === "partnership_rejected") {
        title = "Partnership Application Update";
        heroTitle = "Partnership Update";
        heroIcon = "📄";
        heroBg = "#ef4444";
        body = `
          <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${contactName},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for your interest in collaborating with Uday Foundation Trust on behalf of <strong>${orgName}</strong>.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">After reviewing your request, we regret to inform you that we are unable to approve this partnership at this time.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We appreciate your team's willingness to support community welfare initiatives and invite you to collaborate in future projects.</p>
          
          <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
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
        heroTitle = "Donation Received";
        heroIcon = "❤️";
        heroBg = "#10b981";
        const rows = 
          renderInfoRow("Donor Name", donorName) +
          renderInfoRow("Amount", `₹${formattedAmount}`) +
          renderInfoRow("PAN Number", panNumber) +
          renderInfoRow("Receipt Number", receiptNumber) +
          renderInfoRow("Status", renderBadge("Successful"));
        body = `
          <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${donorName},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for supporting Uday Foundation Trust! Your generosity helps us continue our mission to serve the underprivileged.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Please find your official 80G tax donation receipt attached to this email as a PDF file.</p>
          
          ${renderInfoCard(rows)}
          
          <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
        `;
      } else if (templateName === "donation_failed") {
        title = "Donation Payment Failed";
        heroTitle = "Payment Unsuccessful";
        heroIcon = "🧾";
        heroBg = "#ef4444";
        const rows = 
          renderInfoRow("Donor Name", donorName) +
          renderInfoRow("Attempted Amount", `₹${formattedAmount}`) +
          renderInfoRow("Status", renderBadge("Failed"));
        body = `
          <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${donorName},</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We noticed that your attempt to donate <strong>₹${formattedAmount}</strong> to Uday Foundation Trust could not be completed.</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">No funds were debited from your account. If any amount was debited temporarily, your bank will automatically refund it within 3-5 working days.</p>
          
          ${renderInfoCard(rows)}
          
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">We encourage you to try again or reach out to our team if you need assistance completing your transaction.</p>
          
          ${renderButton("Contact Support", "https://www.udayfoundationstrust.org/contact")}

          <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br><strong>Uday Foundation Trust Team</strong></p>
        `;
      }
    }
  } catch (lookupErr) {
    console.warn("[EmailController] Lookups failed during rebuild:", lookupErr.message);
  }

  return getHtmlTemplate(title, title, body, heroIcon, heroTitle, heroBg);
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
