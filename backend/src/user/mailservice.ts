import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Configuration de Nodemailer avec un serveur SMTP 
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'marzoukrayen99@gmail.com', 
        pass: 'xtuzsnwpgcjskmrn' 
      },
    });
  }


  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'marzoukrayen99@gmail.com', 
      to: to,  
      subject: subject, 
      text: text, 
    };

    try {
     
      await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
  }
}
