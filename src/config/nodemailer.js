import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services too
  auth: {
    user: "testingwork42@gmail.com",
    pass: "ownvlncrecvyqaey",
  },
});

export async function sendAlertEmail(
  userEmail,
  crypto,
  threshold,
  currentPrice
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `${crypto} Price Alert`,
    text: `The price of ${crypto} has reached ${currentPrice} USD, which meets your threshold of ${threshold} USD.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${userEmail} for ${crypto}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
