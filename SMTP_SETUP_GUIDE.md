# SMTP Fallback Setup Guide

Your email system is configured to use Resend as the primary service with SMTP as a fallback. Since Resend is not working, the SMTP fallback should take over automatically. This guide will help you fix the SMTP configuration.

## Issues Identified

1. **Missing Environment Variables**: The SMTP fallback requires proper authentication credentials
2. **Insufficient Error Logging**: Previous version didn't provide clear error messages
3. **No Connection Verification**: SMTP connection wasn't being tested before sending

## Fixed Issues

✅ Added environment variable validation  
✅ Enhanced error logging with specific error codes  
✅ Added SMTP connection verification  
✅ Improved debugging output  
✅ Added TypeScript type safety  

## Setup Instructions

### 1. Create/Update `.env.local` File

Create a `.env.local` file in your project root with these variables:

```bash
# Resend Configuration (Keep this - it's your primary service)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Your Store <noreply@yourdomain.com>"

# SMTP Fallback Configuration (ADD THESE)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Gmail SMTP Setup (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification
3. Enable 2-factor authentication

#### Step 2: Generate App Password
1. Go to Security → 2-Step Verification → App passwords
2. Select "Mail" and "Other (Custom name)"
3. Enter "E-commerce Store" as the custom name
4. Copy the generated 16-character password
5. Use this as your `SMTP_PASS` value

### 3. Alternative SMTP Providers

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo Mail
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

#### Custom SMTP Server
```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
```

## Testing Your Configuration

### Method 1: Use the Test Script

Run the test script to verify your SMTP configuration:

```bash
# Load environment variables and test SMTP
node -r dotenv/config test-smtp.js
```

### Method 2: Place a Test Order

1. Start your development server: `npm run dev`
2. Place a test order through your website
3. Check the console logs for email sending status
4. Look for these log messages:
   - `🚀 Starting email sending process for order: ORD-xxx`
   - `❌ Resend failed, trying SMTP fallback`
   - `🔄 Attempting SMTP fallback email sending...`
   - `✅ SMTP connection verified successfully`
   - `✅ Fallback email sent successfully`

### Method 3: Manual Email API Test

Send a POST request to your email API:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"orderNumber": "ORD-1234567890"}'
```

## Troubleshooting Common Issues

### 1. Authentication Failed (EAUTH)

**Error**: `Authentication failed - check SMTP_USER and SMTP_PASS`

**Solutions**:
- Verify your email address is correct in `SMTP_USER`
- For Gmail: Use an App Password, not your regular password
- For other providers: Check if they require app passwords
- Ensure 2-factor authentication is enabled (for Gmail)

### 2. Connection Failed (ECONNECTION)

**Error**: `Connection failed - check SMTP_HOST and SMTP_PORT`

**Solutions**:
- Verify the SMTP host is correct for your provider
- Check if port 587 is blocked by your firewall/network
- Try port 465 with `secure: true` if 587 doesn't work

### 3. Connection Timeout (ETIMEDOUT)

**Error**: `Connection timed out - check network connection`

**Solutions**:
- Check your internet connection
- Try a different SMTP provider
- Check if your ISP blocks SMTP ports

### 4. Missing Environment Variables

**Error**: `Missing SMTP environment variables: SMTP_USER, SMTP_PASS`

**Solutions**:
- Ensure `.env.local` file exists in project root
- Restart your development server after adding variables
- Check for typos in variable names

## Verification Steps

After setup, verify everything works:

1. **Environment Variables**: Run `node test-smtp.js` to check configuration
2. **SMTP Connection**: Look for "✅ SMTP connection verified successfully"
3. **Test Email**: Check if test email is received in your inbox
4. **Order Flow**: Place a test order and verify email is sent
5. **Console Logs**: Monitor console for detailed error messages

## Security Notes

- Never commit `.env.local` to version control
- Use app passwords instead of regular passwords
- Consider using a dedicated email account for sending
- Regularly rotate app passwords for security

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Use a custom domain for `EMAIL_FROM`
3. Set up SPF and DKIM records for better deliverability
4. Monitor email sending logs for issues
5. Consider upgrading to a dedicated email service

## Contact

If you continue having issues after following this guide:

1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Test with the provided test script
4. Try different SMTP providers if one doesn't work

The improved error logging will now provide much more detailed information about what's going wrong, making it easier to diagnose and fix issues. 