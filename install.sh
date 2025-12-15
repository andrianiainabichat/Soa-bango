#!/bin/bash

# Script d'installation pour Soa Bango
# Ce script automatise la configuration initiale du projet

echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║  🌿  Installation Soa Bango  🌿        ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js (version 14 ou supérieure)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ npm $(npm -v) détecté"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dépendances installées avec succès"
else
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Créer le dossier public s'il n'existe pas
if [ ! -d "public" ]; then
    echo ""
    echo "📁 Création du dossier public..."
    mkdir public
    
    # Copier les fichiers frontend
    if [ -f "index.html" ]; then
        cp index.html public/
        echo "✅ index.html copié dans public/"
    fi
    
    if [ -f "styles.css" ]; then
        cp styles.css public/
        echo "✅ styles.css copié dans public/"
    fi
    
    if [ -f "script.js" ]; then
        cp script.js public/
        echo "✅ script.js copié dans public/"
    fi
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️  Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé depuis .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Veuillez éditer le fichier .env et ajouter:"
    echo "   - Votre mot de passe d'application Gmail (EMAIL_PASS)"
    echo ""
    echo "   Pour créer un mot de passe d'application Gmail:"
    echo "   1. Allez sur https://myaccount.google.com/"
    echo "   2. Sécurité > Validation en deux étapes (activez-la)"
    echo "   3. Sécurité > Mots de passe des applications"
    echo "   4. Créez un nouveau mot de passe pour 'Soa Bango'"
    echo "   5. Copiez-le dans .env (EMAIL_PASS=...)"
    echo ""
else
    echo "✅ Fichier .env existe déjà"
fi

# Créer le dossier logs
if [ ! -d "logs" ]; then
    mkdir logs
    echo "✅ Dossier logs créé"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║                                        ║"
echo "║  ✅  Installation terminée !  ✅       ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📋 Prochaines étapes:"
echo ""
echo "1. Configurez votre fichier .env avec votre mot de passe d'application Gmail"
echo "   nano .env"
echo ""
echo "2. Démarrez le serveur en mode développement:"
echo "   npm run dev"
echo ""
echo "3. Ou en mode production:"
echo "   npm start"
echo ""
echo "4. Ouvrez votre navigateur sur http://localhost:3000"
echo ""
echo "📞 Support: Rhoujo.phanie@gmail.com"
echo "🌐 Site: http://localhost:3000"
echo ""