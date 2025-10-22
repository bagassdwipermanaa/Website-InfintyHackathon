const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Konfigurasi untuk Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken, userName) {
    try {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Reset Password - BlockRights',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center  ; margin-bottom: 30px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">B</span>
              </div>
              <h1 style="color: #333; margin: 0;">Reset Password</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Halo ${userName || 'Pengguna'},</h2>
              <p style="color: #666; line-height: 1.6;">
                Kami menerima permintaan untuk mereset password akun BlockRights Anda. 
                Jika Anda tidak meminta reset password ini, silakan abaikan email ini.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 30px; 
                          border-radius: 8px; 
                          display: inline-block; 
                          font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Atau copy dan paste link berikut ke browser Anda:<br>
                <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
              </p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>Link ini akan expired dalam 1 jam.</p>
              <p>© 2024 BlockRights. All rights reserved.</p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, userName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Selamat Datang di BlockRights!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="color: white; font-size: 24px; font-weight: bold;">B</span>
              </div>
              <h1 style="color: #333; margin: 0;">Selamat Datang!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 12px;">
              <h2 style="color: #333; margin-top: 0;">Halo ${userName},</h2>
              <p style="color: #666; line-height: 1.6;">
                Terima kasih telah bergabung dengan BlockRights! 
                Platform kami membantu melindungi hak cipta digital Anda dengan teknologi blockchain.
              </p>
              
              <h3 style="color: #333;">Fitur yang bisa Anda gunakan:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Upload dan verifikasi karya digital</li>
                <li>Mint NFT untuk karya Anda</li>
                <li>Jual karya di marketplace</li>
                <li>Verifikasi keaslian karya</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 30px; 
                          border-radius: 8px; 
                          display: inline-block; 
                          font-weight: bold;">
                  Mulai Sekarang
                </a>
              </div>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
              <p>© 2024 BlockRights. All rights reserved.</p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;
