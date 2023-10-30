import path from 'path';

const baseTemplatePath = path.resolve(__dirname, '');
const TemplatesPath = path.resolve(baseTemplatePath, '../');
const finalTemplatesPath = path.resolve(TemplatesPath, 'views');

const settings = {
    jwtSecret: process.env.JWT_SECRET || 'SerfTHh7iy0c045duo7poyg9RxdDursH',
    dbConnectionString: process.env.DATABASE_CONNECTION_STRING || 'mysql://root:root@127.0.0.1:3306/trackagram',
    templatesPath: finalTemplatesPath,

    //smtp settings
    smtpServer: {
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
        fromName: process.env.FROM_NAME,
        fromAddress: process.env.FROM_EMAIL,
    },
};
export default settings;
