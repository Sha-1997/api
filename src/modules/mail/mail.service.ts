import { Injectable, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {

  private resend = new Resend(
    process.env.RESEND_API_KEY,
  );


  async sendOtpEmail(
    email: string,
    otp: string,
  ) {

    await this.resend.emails.send({

      from: 'JovianeX <no-reply@jovianex.com>',

      to: email,

      subject: 'Your C Login OTP',

      html: `
        <div>
          <h2>JovianeX  Login</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>
            This OTP expires in 5 minutes.
          </p>

        </div>
      `,
    });

  }

  async sendPasswordResetEmail(
  email: string,
  resetUrl: string,
) {
  try {
    const result = await this.resend.emails.send({
      from: 'JovianeX <info@jovianex.com>',
      to: email,
      subject: 'Reset Your JovianeX Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset Your Password</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f7fa;
              font-family: Arial, Helvetica, sans-serif;
            "
          >

            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              "
            >

              <h2
                style="
                  margin-top: 0;
                  color: #111827;
                "
              >
                Reset Your Password
              </h2>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                We received a request to reset the password for your
                JovianeX account.
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Click the button below to create a new password.
              </p>

              <div style="margin: 30px 0;">
                <a
                  href="${resetUrl}"
                  target="_blank"
                  style="
                    display: inline-block;
                    padding: 14px 28px;
                    background: #111827;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                This password reset link will expire in 1 hour.
              </p>

              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                If you did not request a password reset, you can safely
                ignore this email.
              </p>

              <hr
                style="
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 30px 0;
                "
              />

          <p
            style="
              color: #9ca3af;
              font-size: 12px;
              line-height: 1.5;
              word-break: break-all;
            "
          >
            If the button does not work, copy and paste this link:
            <a
              href="${resetUrl}"
              style="color: #6366f1; text-decoration: underline;"
            >
              Reset Link
            </a>
          </p>

            </div>

          </body>
        </html>
      `,
    });

    console.log('Password reset email sent:', result);

    return result;
  } catch (error) {
    console.error(
      'Failed to send password reset email:',
      error,
    );

    throw new BadRequestException(
      'Unable to send password reset email.',
    );
  }
}

}