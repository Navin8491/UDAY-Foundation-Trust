import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

function getHtmlTemplate(title: string, preheader: string, bodyContent: string, heroIcon = "🤝", heroTitle = "", heroBg = "#1e3a8a") {
  const currentYear = new Date().getFullYear();
  const displayTitle = heroTitle || title;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
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
                          Email: <a href="mailto:udayfts1024@gmail.com" style="color: #1e3a8a; text-decoration: none; font-weight: 600;">udayfts1024@gmail.com</a> &bull; Phone: +91 96246 68484
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

function renderInfoRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #64748b; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left;">${label}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #1e293b; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: right;">${value}</td>
    </tr>
  `;
}

function renderInfoCard(rowsHtml: string) {
  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 16px; margin: 24px 0 16px 0;">
      ${rowsHtml}
    </table>
  `;
}

function renderBadge(status: string) {
  return `<span style="background-color: #d1fae5; color: #047857; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${status}</span>`;
}

function renderButton(text: string, url: string) {
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

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const adminEmail = "udayfts1024@gmail.com";

    // 1. Send admin notification email
    const adminRows = 
      renderInfoRow("Name", name) +
      renderInfoRow("Email", email) +
      renderInfoRow("Phone", phone || "Not provided") +
      renderInfoRow("Subject", subject || "General Inquiry") +
      renderInfoRow("Status", renderBadge("Pending Action"));

    const adminBody = `
      <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello Admin,</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A visitor has submitted a new inquiry via the contact form on your website.</p>
      
      ${renderInfoCard(adminRows)}
      
      <p style="font-size: 14px; color: #475569; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 24px;">Message Details:</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-style: italic; font-size: 13px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${message.replace(/\n/g, "<br/>")}
      </div>
      
      ${renderButton("Open NGO Admin Panel", "https://www.udayfoundationstrust.org/admin")}
    `;

    const adminHtml = getHtmlTemplate(`New Contact Submission: ${subject || "Inquiry"}`, "New Submission Alert for Admin", adminBody, "🔔", "Admin Contact Alert", "#1e3a8a");

    const adminMailResponse = await resend.emails.send({
      from: `Uday Contact Form <${fromEmail}>`,
      to: adminEmail,
      subject: `New Inquiry: ${subject || "Contact Form Submission"}`,
      html: adminHtml,
    });

    if (adminMailResponse.error) {
      console.error("Resend Admin Email Error:", adminMailResponse.error);
      return NextResponse.json(
        { error: adminMailResponse.error.message },
        { status: 500 }
      );
    }

    // 2. Send automated receipt/thank-you email to the visitor
    let userMailResponse = null;
    try {
      const userBody = `
        <p style="font-size: 15px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600; margin-top: 0;">Hello ${name},</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Thank you for reaching out to us. We have successfully received your message regarding "<strong>${subject || "General Inquiry"}</strong>".</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Our team will review your request and get back to you as soon as possible (usually within 24-48 hours).</p>
        
        ${renderButton("Visit Our Website", "https://www.udayfoundationstrust.org")}
        
        <p style="font-size: 14px; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 0; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 24px;">Warm regards,<br/><strong>Uday Foundation Trust Team</strong></p>
      `;

      const userHtml = getHtmlTemplate("Thank you for contacting Uday Foundation Trust", "Thank you for contacting us", userBody, "🤝", "Inquiry Received", "#1e3a8a");

      userMailResponse = await resend.emails.send({
        from: `Uday Foundation Trust <${fromEmail}>`,
        to: email,
        subject: "We received your message – Uday Foundation Trust",
        html: userHtml,
      });
    } catch (userErr) {
      console.warn("Could not send receipt email to visitor:", userErr);
    }

    return NextResponse.json({
      success: true,
      messageId: adminMailResponse.data?.id,
      userReceiptId: userMailResponse?.data?.id || null,
    });
  } catch (error: any) {
    console.error("API Route Send Email Exception:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
