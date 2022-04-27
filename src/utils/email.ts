import nodemailer from "nodemailer";

type typeResponseObject = {
  to: string;
  subject: string;
  body: string;
};

const sendMail = async (data: typeResponseObject) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.body, // plain text body
    html: data.body, // html body
  });

  console.log("Message sent: %s", info);
};

export { sendMail };
