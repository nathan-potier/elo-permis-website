const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    // Sécurité : On n'accepte que les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, phone, email, formula, message } = req.body;

    // Configuration du transporteur Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'nathan.pro.po@gmail.com', // Le mail de réception final
            replyTo: email,
            subject: `Nouvelle inscription sur le site - ${formula}`,
            html: `
                <h2>Nouvelle demande depuis le site internet</h2>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Téléphone :</strong> ${phone}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Formation souhaitée :</strong> ${formula}</p>
                <p><strong>Message / Contraintes :</strong><br/> ${message || 'Aucun message'}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
    } catch (error) {
        console.error('Erreur SMTP:', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi' });
    }
};