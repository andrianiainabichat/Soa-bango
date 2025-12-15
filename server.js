// ===========================
// Server Configuration
// ===========================
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Middleware
// ===========================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ===========================
// Configuration Email (Nodemailer)
// ===========================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'Rhoujo.phanie@gmail.com',
        pass: process.env.EMAIL_PASS // Mot de passe d'application Gmail
    }
});

// Vérifier la connexion email
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Erreur de configuration email:', error);
    } else {
        console.log('✅ Serveur email prêt à envoyer des messages');
    }
});

// ===========================
// Routes API
// ===========================

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Soa Bango API est en ligne',
        timestamp: new Date().toISOString()
    });
});

// Route pour envoyer un email de contact
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validation des données
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez remplir tous les champs obligatoires'
            });
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Adresse email invalide'
            });
        }

        // Configuration de l'email pour le propriétaire
        const ownerMailOptions = {
            from: `Soa Bango Website <${process.env.EMAIL_USER || 'Rhoujo.phanie@gmail.com'}>`,
            to: 'Rhoujo.phanie@gmail.com',
            subject: `🌿 Nouveau message de ${name} - Soa Bango`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Lora', serif;
                            line-height: 1.6;
                            color: #2C1810;
                            background-color: #FAF0E6;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 15px;
                            overflow: hidden;
                            box-shadow: 0 4px 16px rgba(107, 78, 61, 0.12);
                        }
                        .header {
                            background: linear-gradient(135deg, #E8B4B4 0%, #D4A088 100%);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-family: 'Dancing Script', cursive;
                            font-size: 36px;
                        }
                        .content {
                            padding: 30px;
                        }
                        .info-box {
                            background: #F5E6D8;
                            border-left: 4px solid #E8B4B4;
                            padding: 15px;
                            margin: 15px 0;
                            border-radius: 5px;
                        }
                        .info-label {
                            font-weight: bold;
                            color: #6B4E3D;
                            margin-bottom: 5px;
                        }
                        .message-box {
                            background: #FAF0E6;
                            padding: 20px;
                            border-radius: 10px;
                            margin: 20px 0;
                            border: 1px solid #E8B4B4;
                        }
                        .footer {
                            background: #6B4E3D;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            font-size: 14px;
                        }
                        .footer a {
                            color: #E8B4B4;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🌿 Soa Bango</h1>
                            <p style="margin: 10px 0 0 0;">Nouveau Message de Contact</p>
                        </div>
                        <div class="content">
                            <p>Bonjour,</p>
                            <p>Vous avez reçu un nouveau message depuis votre site web Soa Bango :</p>
                            
                            <div class="info-box">
                                <div class="info-label">👤 Nom :</div>
                                <div>${name}</div>
                            </div>
                            
                            <div class="info-box">
                                <div class="info-label">📧 Email :</div>
                                <div><a href="mailto:${email}">${email}</a></div>
                            </div>
                            
                            ${phone ? `
                            <div class="info-box">
                                <div class="info-label">📞 Téléphone :</div>
                                <div><a href="tel:${phone}">${phone}</a></div>
                            </div>
                            ` : ''}
                            
                            <div class="message-box">
                                <div class="info-label">💬 Message :</div>
                                <div>${message.replace(/\n/g, '<br>')}</div>
                            </div>
                            
                            <p style="margin-top: 30px;">
                                <strong>Date de réception :</strong> ${new Date().toLocaleString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div class="footer">
                            <p>Ce message a été envoyé depuis le formulaire de contact de <a href="#">soabango.com</a></p>
                            <p>© 2024 Soa Bango - Soins Naturels & Cosmétiques</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Configuration de l'email de confirmation pour le client
        const clientMailOptions = {
            from: `Soa Bango <${process.env.EMAIL_USER || 'Rhoujo.phanie@gmail.com'}>`,
            to: email,
            subject: '🌿 Merci pour votre message - Soa Bango',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Lora', serif;
                            line-height: 1.6;
                            color: #2C1810;
                            background-color: #FAF0E6;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 15px;
                            overflow: hidden;
                            box-shadow: 0 4px 16px rgba(107, 78, 61, 0.12);
                        }
                        .header {
                            background: linear-gradient(135deg, #E8B4B4 0%, #D4A088 100%);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-family: 'Dancing Script', cursive;
                            font-size: 36px;
                        }
                        .content {
                            padding: 30px;
                        }
                        .highlight-box {
                            background: linear-gradient(135deg, #F4D7D7 0%, #F5E6D8 100%);
                            padding: 20px;
                            border-radius: 10px;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .contact-info {
                            background: #FAF0E6;
                            padding: 20px;
                            border-radius: 10px;
                            margin: 20px 0;
                        }
                        .contact-item {
                            margin: 10px 0;
                        }
                        .footer {
                            background: #6B4E3D;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            font-size: 14px;
                        }
                        .social-links {
                            margin-top: 15px;
                        }
                        .social-links a {
                            display: inline-block;
                            margin: 0 10px;
                            color: #E8B4B4;
                            text-decoration: none;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🌿 Soa Bango</h1>
                            <p style="margin: 10px 0 0 0;">Beauté Naturelle - Authenticité Garantie</p>
                        </div>
                        <div class="content">
                            <p>Bonjour <strong>${name}</strong>,</p>
                            
                            <div class="highlight-box">
                                <h2 style="margin: 0 0 10px 0; color: #6B4E3D;">Merci pour votre message !</h2>
                                <p style="margin: 0;">Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
                            </div>
                            
                            <p>Notre équipe examine attentivement chaque message et s'efforcera de vous répondre sous 24 à 48 heures.</p>
                            
                            <p>En attendant, n'hésitez pas à découvrir notre gamme complète de produits naturels et nos services de soins capillaires et du visage.</p>
                            
                            <div class="contact-info">
                                <h3 style="color: #6B4E3D; margin-top: 0;">📞 Vous pouvez aussi nous contacter :</h3>
                                <div class="contact-item">
                                    <strong>Téléphone :</strong> <a href="tel:+261386791294" style="color: #E8B4B4;">+261 38 67 912 94</a>
                                </div>
                                <div class="contact-item">
                                    <strong>Email :</strong> <a href="mailto:Rhoujo.phanie@gmail.com" style="color: #E8B4B4;">Rhoujo.phanie@gmail.com</a>
                                </div>
                                <div class="contact-item">
                                    <strong>Adresse :</strong> Antananarivo, Madagascar
                                </div>
                                <div class="contact-item">
                                    <strong>Horaires :</strong> Lun - Sam: 9h - 18h
                                </div>
                            </div>
                            
                            <p style="text-align: center; margin-top: 30px; color: #6B4E3D;">
                                <strong>✨ Votre beauté naturelle, notre passion ✨</strong>
                            </p>
                        </div>
                        <div class="footer">
                            <p><strong>Suivez-nous sur les réseaux sociaux</strong></p>
                            <div class="social-links">
                                <a href="#">Facebook</a>
                                <a href="#">Instagram</a>
                                <a href="#">WhatsApp</a>
                            </div>
                            <p style="margin-top: 20px;">© 2024 Soa Bango - Tous droits réservés</p>
                            <p>Fait avec 💚 à Madagascar</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Envoyer les emails
        await transporter.sendMail(ownerMailOptions);
        await transporter.sendMail(clientMailOptions);

        // Logger l'activité
        console.log(`✅ Message envoyé de ${name} (${email})`);

        res.json({
            success: true,
            message: 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.'
        });

    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi du message:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
        });
    }
});

// Route pour recevoir les commandes de produits
app.post('/api/order', async (req, res) => {
    try {
        const { productName, productPrice, customerName, customerEmail, customerPhone, quantity, message } = req.body;

        // Validation des données
        if (!productName || !customerName || !customerEmail || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez remplir tous les champs obligatoires'
            });
        }

        const totalPrice = productPrice * (quantity || 1);

        // Email pour le propriétaire
        const orderMailOptions = {
            from: `Soa Bango Orders <${process.env.EMAIL_USER || 'Rhoujo.phanie@gmail.com'}>`,
            to: 'Rhoujo.phanie@gmail.com',
            subject: `🛍️ Nouvelle commande : ${productName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Lora', serif;
                            line-height: 1.6;
                            color: #2C1810;
                            background-color: #FAF0E6;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 15px;
                            overflow: hidden;
                            box-shadow: 0 4px 16px rgba(107, 78, 61, 0.12);
                        }
                        .header {
                            background: linear-gradient(135deg, #A5D6A7 0%, #8BC68A 100%);
                            padding: 30px;
                            text-align: center;
                            color: white;
                        }
                        .content {
                            padding: 30px;
                        }
                        .order-box {
                            background: #F4D7D7;
                            padding: 20px;
                            border-radius: 10px;
                            margin: 20px 0;
                            border: 2px solid #E8B4B4;
                        }
                        .info-row {
                            margin: 10px 0;
                            padding: 10px;
                            background: white;
                            border-radius: 5px;
                        }
                        .label {
                            font-weight: bold;
                            color: #6B4E3D;
                        }
                        .total {
                            font-size: 24px;
                            font-weight: bold;
                            color: #6B4E3D;
                            text-align: center;
                            margin: 20px 0;
                            padding: 15px;
                            background: #F5E6D8;
                            border-radius: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🛍️ Nouvelle Commande</h1>
                        </div>
                        <div class="content">
                            <div class="order-box">
                                <h2 style="margin-top: 0; color: #6B4E3D;">Détails de la commande</h2>
                                <div class="info-row">
                                    <span class="label">Produit :</span> ${productName}
                                </div>
                                <div class="info-row">
                                    <span class="label">Prix unitaire :</span> ${productPrice} Ar
                                </div>
                                <div class="info-row">
                                    <span class="label">Quantité :</span> ${quantity || 1}
                                </div>
                            </div>
                            
                            <div class="total">
                                Total : ${totalPrice.toLocaleString()} Ar
                            </div>
                            
                            <h3 style="color: #6B4E3D;">Informations Client</h3>
                            <div class="info-row">
                                <span class="label">Nom :</span> ${customerName}
                            </div>
                            <div class="info-row">
                                <span class="label">Email :</span> <a href="mailto:${customerEmail}">${customerEmail}</a>
                            </div>
                            <div class="info-row">
                                <span class="label">Téléphone :</span> <a href="tel:${customerPhone}">${customerPhone}</a>
                            </div>
                            
                            ${message ? `
                            <div class="info-row" style="margin-top: 20px;">
                                <span class="label">Message :</span><br>
                                ${message}
                            </div>
                            ` : ''}
                            
                            <p style="margin-top: 30px;">
                                <strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(orderMailOptions);

        console.log(`✅ Commande reçue : ${productName} de ${customerName}`);

        res.json({
            success: true,
            message: 'Votre commande a été enregistrée ! Nous vous contacterons bientôt.'
        });

    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement de la commande:', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur s\'est produite. Veuillez réessayer.'
        });
    }
});

// Route pour recevoir les inscriptions à la newsletter
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email requis'
            });
        }

        const newsletterMailOptions = {
            from: `Soa Bango <${process.env.EMAIL_USER || 'Rhoujo.phanie@gmail.com'}>`,
            to: 'Rhoujo.phanie@gmail.com',
            subject: '📧 Nouvelle inscription Newsletter',
            html: `
                <h2>Nouvelle inscription à la newsletter</h2>
                <p><strong>Email :</strong> ${email}</p>
                ${name ? `<p><strong>Nom :</strong> ${name}</p>` : ''}
                <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
            `
        };

        await transporter.sendMail(newsletterMailOptions);

        res.json({
            success: true,
            message: 'Merci de vous être inscrit à notre newsletter !'
        });

    } catch (error) {
        console.error('❌ Erreur newsletter:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription'
        });
    }
});

// ===========================
// Servir les fichiers statiques
// ===========================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===========================
// Démarrage du serveur
// ===========================
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║                                        ║');
    console.log('║       🌿  Soa Bango API Server  🌿     ║');
    console.log('║                                        ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📧 Email configuré: Rhoujo.phanie@gmail.com`);
    console.log(`📞 Téléphone: +261 38 67 912 94`);
    console.log('');
    console.log('Endpoints disponibles:');
    console.log('  - GET  /api/health');
    console.log('  - POST /api/contact');
    console.log('  - POST /api/order');
    console.log('  - POST /api/newsletter');
    console.log('');
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non capturée:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promesse rejetée non gérée:', error);
});

module.exports = app;