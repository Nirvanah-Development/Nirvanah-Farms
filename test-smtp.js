const nodemailer = require('nodemailer');

async function testSMTP() {
  console.log('🧪 Testing SMTP Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
  console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT SET ❌');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : 'NOT SET ❌');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET ❌');
  console.log('');

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ SMTP_USER and SMTP_PASS are required!');
    console.log('\n💡 Add these to your .env.local file:');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=your-email@gmail.com');
    console.log('SMTP_PASS=your-app-password');
    console.log('EMAIL_FROM="Your Store <noreply@yourstore.com>"');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
      logger: true,
    });

    console.log('🔧 SMTP transporter created');

    // Test connection
    console.log('🔌 Testing connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send test email
    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Test <test@example.com>',
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: 'SMTP Test Email - ' + new Date().toISOString(),
      text: `This is a test email to verify your SMTP configuration.

Sent at: ${new Date().toISOString()}
SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}
SMTP Port: ${process.env.SMTP_PORT || '587'}

If you received this email, your SMTP configuration is working correctly!`,
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('\n🎉 Your SMTP configuration is working!');

  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication Error:');
      console.error('- Check your SMTP_USER (email address)');
      console.error('- Check your SMTP_PASS (app password)');
      console.error('- For Gmail: Generate an App Password in Google Account settings');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔌 Connection Error:');
      console.error('- Check your SMTP_HOST and SMTP_PORT');
      console.error('- Check your internet connection');
      console.error('- Check if firewall is blocking the connection');
    } else {
      console.error('\n🐛 Error details:', error);
    }
  }
}

testSMTP(); 