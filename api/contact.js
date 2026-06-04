import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // On n'accepte que les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, phone, email, formula, message } = req.body;

    // Configuration du transporteur (Ici on utilise Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // L'email qui ENVOIE (ex: ton email pro ou celui de l'auto-école)
            pass: process.env.EMAIL_PASS  // Le mot de passe d'application Gmail
        }
    });

    try {
        // Paramètres de l'email à envoyer
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'elopermis77@gmail.com', // L'email de réception final (celui d'Élodie)
            replyTo: email, // Permet à Élodie de faire "Répondre" directement au client
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

        // Envoi de l'email
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
    } catch (error) {
        console.error('Erreur d\'envoi:', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email' });
    }
}