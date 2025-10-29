const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Eksik alanlar var.' });
    }

    const toEmail = process.env.TO_EMAIL || process.env.GMAIL_USER;
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !toEmail) {
      return res.status(500).json({ ok: false, error: 'Sunucu e-posta yapılandırması eksik.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `Portfolyo İletişim <${process.env.GMAIL_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `Portfolyo İletişim: ${name}`,
      text: `${message}\n\nİsim: ${name}\nE-posta: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>Yeni İletişim Mesajı</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><strong>İsim:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
        </div>
      `,
    });

    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Mail gönderimi hatası:', err);
    res.status(500).json({ ok: false, error: 'Gönderim sırasında hata oluştu.' });
  }
});

// Fallback to index.html for root
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
