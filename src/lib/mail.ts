import ejs from 'ejs';
import settings from '../config/settings';
import path from 'path';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  cc?: string;
  subject: string;
  templatePath: string;
  data?: any;
  file?: any[];
  type?: string;
}

const getTransporter = () => {
  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: settings.smtpServer.host,
    port: settings.smtpServer.port,
    auth: {
      user: settings.smtpServer.user,
      pass: settings.smtpServer.pass,
    },
  });

  return transporter;
};

export const sendEmail = async ({
  to,
  cc,
  subject,
  templatePath,
  data = null,
  file = [],
  type = '',
}: EmailOptions): Promise<boolean> => {
  const html = await ejs.renderFile(path.join(settings.templatesPath, templatePath), data);
  const mailOptions = {
    from: {
      name: settings.smtpServer.fromName as string,
      address: settings.smtpServer.fromAddress as string,
    },
    to: to,
    cc: cc,
    subject: subject,
    html: html,
    attachments: file,
  };
  try {
    const transporter = getTransporter();
    // @ts-ignore
    const info = await transporter.sendMail(mailOptions);
    // @ts-ignore
    console.log(`Email sent: ${info.response}`);
    return true;
  } catch (err) {
    // @ts-ignore
    console.log(err.message);
    console.log(`Error sending email: ${err}`);
    return false;
  }
};
