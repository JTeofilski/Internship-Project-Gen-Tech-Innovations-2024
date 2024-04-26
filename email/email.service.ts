import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';

Injectable();
export class EmailService {
  async sendEmail(
    userEmail: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.TRANSPORTER_USER,
      to: userEmail,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  }
}
