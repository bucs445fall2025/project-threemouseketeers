// email validation logic

//utilizes a mail.visitu@gmail.com email account to send confirmation email 
// sends "challenge code" and backend will catch and associate w account

const nodemailer = require("nodemailer");
// const crypto = require("crypto");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mail.visitu@gmail.com",
    // pass: process.env.GOOGLE_APP_PASSWORD,
    pass:"iine vtmq jaof tgrr",
  },
});

/**
 * @brief Sends an account-verification email to a user.
 *
 * Uses a configured Gmail SMTP transporter to deliver a verification link.
 * The message includes both plaintext and HTML versions.
 *
 * @param address The destination email address.
 * @param link A verification URL that the user will click to confirm their account.
 *
 * @returns Promise<void>
 * @throws Any SMTP, authentication, or connectivity error from nodemailer.
 *
 * @note Relies on a Gmail account configured in the transporter.  
 * @note Sends from the "VisitU" no-reply identity.
 */
async function sendAccountEmail({ address, link }) {
    const info = await transporter.sendMail({
    from: '"VisitU" <no-reply.mail.visitu@gmail.com>',
    to: address,
    subject: 'verify your VisitU account',
    text: `Please verify your VisitU account: ${link}`,
    html: `<b>hello, please click on the link below to verify your visitU account!</b>\
    <p><a href="${link}" style="font-size:16px; color:#2a7bff;">Verify account email</a></p>`
  });

  console.log("Message sent:", info.messageId);
}

/**
 * @brief Performs a simple XOR-based obfuscation of an email using the username as key material.
 *
 * Iterates over each byte of the email, XORs it with the corresponding byte
 * of the username (cycled to match length), and encodes the result using
 * URL-safe Base64.
 *
 * @param email The email string to obfuscate.
 * @param username The username whose characters form the XOR key.
 * @returns A URL-safe Base64 encoded string representing the XOR result.
 */
function xorEncrypt(email, username) {
  let out = [];
  for (let i = 0; i < email.length; i++) {
    const e = email.charCodeAt(i);
    const k = username.charCodeAt(i % username.length);
    out.push(e ^ k);
  }
  return Buffer.from(out).toString('base64url'); // URL-safe encoding
}

module.exports = {sendAccountEmail, xorEncrypt};