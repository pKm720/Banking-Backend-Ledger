require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error);
     return { success: false, error }
  }
};
async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name}, 

        Welcome to Backend Ledger! Your account has been successfully created.

        You can now start managing your accounts, tracking transactions, and viewing your financial ledger.

        Best regards,
        Backend Ledger Team`;

            const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Welcome to Backend Ledger</title>
            </head>

            <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Georgia',serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:48px 16px;">
                <tr>
                <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#111111;border:1px solid #2a2a2a;border-bottom:3px solid #c9a84c;padding:36px 40px;text-align:center;border-radius:4px 4px 0 0;">
                        <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;">
                            Backend Ledger
                        </p>
                        <h1 style="margin:0;font-size:26px;font-weight:400;color:#f5f0e8;letter-spacing:1px;">
                            Welcome
                        </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background-color:#161616;border:1px solid #2a2a2a;border-top:none;padding:40px;">

                        <p style="margin:0 0 24px 0;font-size:15px;color:#a89880;line-height:1.7;">
                            Dear <span style="color:#f5f0e8;font-weight:600;">${name}</span>,
                        </p>

                        <p style="margin:0 0 32px 0;font-size:15px;color:#a89880;line-height:1.7;">
                            Welcome to <span style="color:#f5f0e8;">Backend Ledger</span>. Your account has been successfully created.
                            We're excited to have you join our platform.
                        </p>

                        <!-- Feature Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1a14;border:1px solid #c9a84c33;border-radius:4px;margin-bottom:32px;">
                            <tr>
                            <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">
                                    What You Can Do
                                </p>
                                <p style="margin:6px 0 0 0;font-size:15px;color:#f5f0e8;">
                                    Manage accounts, track transactions, and maintain your financial ledger securely.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding:20px 24px;">
                                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">
                                    Platform
                                </p>
                                <p style="margin:6px 0 0 0;font-size:15px;color:#f5f0e8;">
                                    Secure · Transparent · Reliable
                                </p>
                            </td>
                            </tr>
                        </table>

                        <p style="margin:0;font-size:13px;color:#6b5f4e;line-height:1.7;">
                            If you did not create this account, please contact our support team immediately.
                        </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#111111;border:1px solid #2a2a2a;border-top:none;padding:24px 40px;text-align:center;border-radius:0 0 4px 4px;">
                        <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">
                            © ${new Date().getFullYear()} Backend Ledger · All rights reserved
                        </p>
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
            </html>`;

            await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Confirmation – Backend Ledger';
    const text = `Hello ${name}, a transaction of $${amount} to account ${toAccount} was processed successfully.`;
    const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Transaction Confirmation</title>
            </head>
            <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Georgia',serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:48px 16px;">
                <tr>
                <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#111111;border:1px solid #2a2a2a;border-bottom:3px solid #c9a84c;padding:36px 40px;text-align:center;border-radius:4px 4px 0 0;">
                        <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;">Backend Ledger</p>
                        <h1 style="margin:0;font-size:26px;font-weight:400;color:#f5f0e8;letter-spacing:1px;">Transaction Confirmed</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background-color:#161616;border:1px solid #2a2a2a;border-top:none;padding:40px;">

                        <p style="margin:0 0 24px 0;font-size:15px;color:#a89880;line-height:1.7;">
                            Dear <span style="color:#f5f0e8;font-weight:600;">${name}</span>,
                        </p>
                        <p style="margin:0 0 32px 0;font-size:15px;color:#a89880;line-height:1.7;">
                            Your transaction has been processed successfully. Here's a summary:
                        </p>

                        <!-- Transaction Details Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1a14;border:1px solid #c9a84c33;border-radius:4px;margin-bottom:32px;">
                            <tr>
                            <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">Amount Sent</p>
                                <p style="margin:6px 0 0 0;font-size:28px;color:#f5f0e8;letter-spacing:1px;">₹${amount}</p>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding:20px 24px;">
                                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;">Recipient Account</p>
                                <p style="margin:6px 0 0 0;font-size:15px;color:#f5f0e8;font-family:'Courier New',monospace;letter-spacing:1px;">${toAccount}</p>
                            </td>
                            </tr>
                        </table>

                        <p style="margin:0 0 8px 0;font-size:13px;color:#6b5f4e;line-height:1.7;">
                            If you did not authorize this transaction, please contact our support team immediately.
                        </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#111111;border:1px solid #2a2a2a;border-top:none;padding:24px 40px;text-align:center;border-radius:0 0 4px 4px;">
                        <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">
                            © ${new Date().getFullYear()} Backend Ledger · All rights reserved
                        </p>
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
            </html>`;
    await sendEmail (userEmail, subject, text, html)
}

async function transactionFailedEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed – Backend Ledger';
    const text = `Hello ${name}, your transaction of $${amount} to account ${toAccount} has failed. Please try again or contact support.`;
    const html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Transaction Failed</title>
                </head>
                <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Georgia',serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:48px 16px;">
                    <tr>
                    <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

                        <!-- Header -->
                        <tr>
                            <td style="background-color:#111111;border:1px solid #2a2a2a;border-bottom:3px solid #c0392b;padding:36px 40px;text-align:center;border-radius:4px 4px 0 0;">
                            <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c0392b;">Backend Ledger</p>
                            <h1 style="margin:0;font-size:26px;font-weight:400;color:#f5f0e8;letter-spacing:1px;">Transaction Failed</h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="background-color:#161616;border:1px solid #2a2a2a;border-top:none;padding:40px;">

                            <!-- Alert Banner -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1010;border:1px solid #c0392b44;border-left:3px solid #c0392b;border-radius:4px;margin-bottom:32px;">
                                <tr>
                                <td style="padding:16px 20px;">
                                    <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c0392b;">⚠ Transaction Unsuccessful</p>
                                </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 24px 0;font-size:15px;color:#a89880;line-height:1.7;">
                                Dear <span style="color:#f5f0e8;font-weight:600;">${name}</span>,
                            </p>
                            <p style="margin:0 0 32px 0;font-size:15px;color:#a89880;line-height:1.7;">
                                Unfortunately, your transaction could not be completed. Here are the details:
                            </p>

                            <!-- Transaction Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e1010;border:1px solid #c0392b33;border-radius:4px;margin-bottom:32px;">
                                <tr>
                                <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                                    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c0392b;">Amount</p>
                                    <p style="margin:6px 0 0 0;font-size:28px;color:#f5f0e8;letter-spacing:1px;text-decoration:line-through;opacity:0.6;">$${amount}</p>
                                </td>
                                </tr>
                                <tr>
                                <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                                    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c0392b;">Recipient Account</p>
                                    <p style="margin:6px 0 0 0;font-size:15px;color:#f5f0e8;font-family:'Courier New',monospace;letter-spacing:1px;">${toAccount}</p>
                                </td>
                                </tr>
                                <tr>
                                <td style="padding:20px 24px;">
                                    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c0392b;">Status</p>
                                    <p style="margin:6px 0 0 0;font-size:13px;color:#c0392b;letter-spacing:1px;">● FAILED</p>
                                </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 8px 0;font-size:13px;color:#6b5f4e;line-height:1.7;">
                                This may be due to insufficient funds, a network issue, or a security hold. 
                                Please verify your account details and try again. If the issue persists, contact our support team.
                            </p>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#111111;border:1px solid #2a2a2a;border-top:none;padding:24px 40px;text-align:center;border-radius:0 0 4px 4px;">
                            <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4a4035;">
                                © ${new Date().getFullYear()} Backend Ledger · All rights reserved
                            </p>
                            </td>
                        </tr>

                        </table>
                    </td>
                    </tr>
                </table>
                </body>
                </html>`;
    await sendEmail (userEmail, subject, text, html)
}




module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    transactionFailedEmail,
}