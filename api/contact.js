const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Eksik alanlar var.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.TO_EMAIL || process.env.FROM_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
      return res.status(500).json({ ok: false, error: 'Sunucu e-posta yapılandırması eksik.' });
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Portfolyo İletişim: ${name}`,
      text: `${message}\n\nİsim: ${name}\nE-posta: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>Yeni İletişim Mesajı</h2>
          <p>${String(message).replace(/\n/g, '<br>')}</p>
          <hr>
          <p><strong>İsim:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ ok: false, error: 'Gönderim sırasında hata oluştu.' });
    }

    return res.status(200).json({ ok: true, id: data && data.id });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ ok: false, error: 'Beklenmeyen bir hata oluştu.' });
  }
};
