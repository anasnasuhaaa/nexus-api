import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams) {
  const from = process.env.EMAIL_FROM;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY belum diatur.");
  }

  if (!from) {
    throw new Error("EMAIL_FROM belum diatur.");
  }

  return resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });
}