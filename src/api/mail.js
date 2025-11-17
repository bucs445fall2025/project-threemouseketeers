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

// sendMail({
//     to:"mail@seniho.com",
//     subject:"please confirm your ",
//     text:"hey there, this is a test",
//     html: "<h1> HELLO WORLD</h1>",
// })
// account = "mail@seniho.com"
// link = "https://seniho.com/resume"
// sendAccountEmail({address: account, link:link })


// (async () => {
//   const info = await transporter.sendMail({
//     from: '"noreply" <mail.visitu@gmail.com>',
//     to: "mail@seniho.com, sokuyuc1@binghamton.edu",
//     subject: "Hello ✔",
//     text: "Hello world?", // plain‑text body
//     html: "<b>Hello world?</b>", // HTML body
//   });

//   console.log("Message sent:", info.messageId);
// })();

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