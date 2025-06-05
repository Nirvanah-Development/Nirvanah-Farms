# Email Configuration Setup

To enable email functionality for order confirmations, you need to set up the following environment variables in your `.env.local` file:

## Option 1: Resend API (Recommended)

Resend is a modern email service that's easy to set up and reliable.

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add these variables to your `.env.local`:

```bash
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Your Store <noreply@yourdomain.com>"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Option 2: SMTP (Fallback)

If Resend fails, the system will automatically fall back to SMTP. Configure these for Gmail or other SMTP providers:

```bash
# SMTP Configuration (Fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an "App Password" 
3. Use the app password as `SMTP_PASS`

## Environment Variables Explained

- `RESEND_API_KEY`: Your Resend API key
- `EMAIL_FROM`: The email address and name that emails will be sent from
- `NEXT_PUBLIC_BASE_URL`: Your app's URL (use full domain in production)
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (usually 587 for TLS)
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email password or app password

## Production Setup

For production, make sure to:
1. Use your actual domain for `EMAIL_FROM`
2. Set `NEXT_PUBLIC_BASE_URL` to your production URL
3. Consider using a dedicated email service domain
4. Test email delivery thoroughly

## Testing

After setting up, test the email functionality by:
1. Placing a test order
2. Checking your email inbox
3. Verifying the email content and formatting 