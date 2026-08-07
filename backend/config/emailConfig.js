const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using the default SMTP transport
// Testing Free gmail send Code
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// cpanel Email using Transport

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Admin-ku send aagum email- template.
 * @param {object} data - Form data (name, email, phone, message)
 * @returns {object} Mail options object
 */

const adminMailOptions = (data) => ({
  from: `Indolankamatrimony services <${process.env.EMAIL_USER}>`,
  to: process.env.ADMIN_EMAIL,
  replyTo: data.email,
  subject: `🚨 NEW ENQUIRY: ${data.name}`, // Subject-a update pannirukken
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 20px auto; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">New Contact Form Submission</h2>
        </div>
        <div style="padding: 25px;">
            <p style="font-size: 16px;"><strong>Details of the enquiry:</strong></p>
            
            <div style="border: 1px solid #f0f0f0; padding: 15px; border-radius: 6px; margin-bottom: 20px; background-color: #f9f9f9;">
                <p style="margin: 5px 0;"><strong>Name:</strong> <span style="color: #007bff; font-weight: bold;">${data.name}</span></p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">${data.email}</a></p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> <span style="color: #007bff;">${data.phone}</span></p>
            </div>
            
            <h3 style="color: #007bff; border-bottom: 2px solid #eeeeee; padding-bottom: 5px;">Message:</h3>
            <p style="background-color: #eeeeee; padding: 15px; border-radius: 4px; border-left: 5px solid #007bff;">${data.message}</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #777777;">Please respond to this customer promptly.</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
            This email was sent from the Indolankamatrimony contact form.
        </div> 
    </div>
  `,
});

/**
 * User-ku send aagum email- template.
 * @param {object} data - Form data (name, email, phone, message)
 * @returns {object} Mail options object
 */

const userMailOptions = (data) => ({
  from: `Indolankamatrimony services <${process.env.EMAIL_USER}>`,
  to: data.email,
  subject: `✅ We received your enquiry, ${data.name}!`, // Subject-a update pannirukken
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 20px auto; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">Thank You for Contacting Us!</h2>
        </div>
        <div style="padding: 25px;">
            <p style="font-size: 16px;">Dear <strong>${data.name}</strong>,</p>
            
            <div style="background-color: #e6ffe6; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 5px solid #4CAF50;">
                <p style="margin: 0;">We have successfully received your enquiry. Our team is already reviewing your message and we aim to get back to you within 24 hours.</p>
            </div>
            
            <h4 style="color: #4CAF50;">Your Submitted Details:</h4>
            <ul style="list-style-type: none; padding-left: 0;">
                <li><strong>Name:</strong> ${data.name}</li>
                <li><strong>Message:</strong> "${data.message.substring(
                  0,
                  50
                )}..."</li>
            </ul>
            
            <p style="margin-top: 30px;">Regards,<br/>The <strong>Indolankamatrimony Team</strong></p>
        </div>
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Indolankamatrimony Services. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Visit our site: <a href="[Your Website URL]" style="color: #007bff; text-decoration: none;">[Your Website URL]</a></p>
        </div>
    </div>
  `,
});

module.exports = { transporter, adminMailOptions, userMailOptions };
