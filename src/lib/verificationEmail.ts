import { sendEmail } from '../lib/mail';

interface VerificationEmail {
  userEmail: string;
  user_name: string;
  verificationToken: string;
}

export default async function sendVerificationEmail(userEmail: string, user_name: string, verificationToken: string): Promise<VerificationEmail> {
  // Business logic
  await sendEmail({
    to: userEmail,
    subject: 'Verify your email address',
    templatePath: '/email-templates/creative-email/index.ejs',
    data: {
      name: user_name,
      link: `http://localhost:8080/api/auth/verify?token=${verificationToken}`
    },
  });

  return { userEmail, user_name, verificationToken };
}
