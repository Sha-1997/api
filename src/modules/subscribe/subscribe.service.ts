import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SubscribeService {
  private resend: Resend;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.resend = new Resend(
      this.configService.get<string>('resend.apiKey'),
    );
  }

  async subscribe(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existingSubscriber =
      await this.prisma.newsletterSubscriber.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingSubscriber) {
      return {
        success: true,
        subscribed: true,
        alreadySubscribed: true,
        message: 'This email is already subscribed.',
      };
    }

    // Save subscriber to PostgreSQL FIRST
    const subscriber =
      await this.prisma.newsletterSubscriber.create({
        data: {
          email: normalizedEmail,
          status: 'SUBSCRIBED',
          source: 'FOOTER',
        },
      });

    // Send notification to admin
    await this.resend.emails.send({
      from: 'JovianeX AI Ecosystem <info@jovianex.com>',
      to: 'info@jovianex.com',
      subject: 'New Newsletter Subscription',
      html: `
        <h2>New Subscriber</h2>
        <p>Email: ${normalizedEmail}</p>
        <p>Subscriber ID: ${subscriber.id}</p>
      `,
    });

    // Send success email to subscriber
    await this.resend.emails.send({
      from: 'JovianeX AI Ecosystem <info@jovianex.com>',
      to: normalizedEmail,
      subject: 'Subscription Successful',
      html: `
        <h2>Thank you for subscribing 🎉</h2>
        <p>
          You have successfully subscribed to JovianeX updates.
        </p>
        <p>
          We will keep you updated with our latest news and announcements.
        </p>
      `,
    });

    return {
      success: true,
      subscribed: true,
      alreadySubscribed: false,
      subscriberId: subscriber.id,
      message: 'Subscription successful',
    };
  }
}