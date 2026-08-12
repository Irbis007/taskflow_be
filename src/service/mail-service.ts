import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendActivationMail = async (to: string, link: string) => {
  transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Account activation " + process.env.API_URL,
    text: "",
    html: `
    <div>
      <h1>Activate your account</h1>
      <a href="${process.env.API_URL}/api/activate/${link}">click here</a>
    </div>
    `,
  });
};

export const mailService = { sendActivationMail };
