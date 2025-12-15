// Test de configuration du serveur Soa Bango
// Exécutez ce fichier avec: node test-config.js

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════╗');
console.log('║                                        ║');
console.log('║  🧪  Test Configuration Soa Bango  🧪  ║');
console.log('║                                        ║');
console.log('╚════════════════════════════════════════╝\n');

let allTestsPassed = true;

// Test 1: Vérifier que Node.js est à jour
console.log('📋 Test 1: Version Node.js');
const nodeVersion = process.version;
const nodeMajorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (nodeMajorVersion >= 14) {
    console.log(`✅ Node.js ${nodeVersion} (version supportée)\n`);
} else {
    console.log(`❌ Node.js ${nodeVersion} (version 14+ requise)\n`);
    allTestsPassed = false;
}

// Test 2: Vérifier que package.json existe
console.log('📋 Test 2: Fichier package.json');
if (fs.existsSync('./package.json')) {
    const packageJson = require('./package.json');
    console.log(`✅ package.json trouvé - ${packageJson.name} v${packageJson.version}\n`);
} else {
    console.log('❌ package.json non trouvé\n');
    allTestsPassed = false;
}

// Test 3: Vérifier que node_modules existe
console.log('📋 Test 3: Dépendances installées');
if (fs.existsSync('./node_modules')) {
    console.log('✅ Dossier node_modules trouvé - dépendances installées\n');
} else {
    console.log('❌ Dossier node_modules non trouvé - exécutez "npm install"\n');
    allTestsPassed = false;
}

// Test 4: Vérifier que le fichier .env existe
console.log('📋 Test 4: Fichier .env');
if (fs.existsSync('./.env')) {
    console.log('✅ Fichier .env trouvé');
    
    // Lire le fichier .env
    const envContent = fs.readFileSync('./.env', 'utf8');
    
    // Vérifier EMAIL_PASS
    if (envContent.includes('EMAIL_PASS=votre_mot_de_passe_application_gmail') || 
        envContent.includes('EMAIL_PASS=') && envContent.split('EMAIL_PASS=')[1].split('\n')[0].trim() === '') {
        console.log('⚠️  EMAIL_PASS non configuré - veuillez ajouter votre mot de passe d\'application Gmail');
        console.log('   Voir README.md pour les instructions\n');
    } else {
        console.log('✅ EMAIL_PASS configuré\n');
    }
} else {
    console.log('❌ Fichier .env non trouvé - copiez .env.example vers .env\n');
    allTestsPassed = false;
}

// Test 5: Vérifier que le dossier public existe
console.log('📋 Test 5: Dossier public');
if (fs.existsSync('./public')) {
    console.log('✅ Dossier public trouvé');
    
    // Vérifier les fichiers frontend
    const requiredFiles = ['index.html', 'styles.css', 'script.js'];
    let missingFiles = [];
    
    requiredFiles.forEach(file => {
        if (!fs.existsSync(`./public/${file}`)) {
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length === 0) {
        console.log('✅ Tous les fichiers frontend sont présents\n');
    } else {
        console.log(`⚠️  Fichiers manquants dans public/: ${missingFiles.join(', ')}`);
        console.log('   Copiez index.html, styles.css, et script.js dans le dossier public/\n');
    }
} else {
    console.log('❌ Dossier public non trouvé - créez-le et ajoutez les fichiers frontend\n');
    allTestsPassed = false;
}

// Test 6: Vérifier que server.js existe
console.log('📋 Test 6: Fichier server.js');
if (fs.existsSync('./server.js')) {
    console.log('✅ server.js trouvé\n');
} else {
    console.log('❌ server.js non trouvé\n');
    allTestsPassed = false;
}

// Test 7: Vérifier les dépendances essentielles
console.log('📋 Test 7: Dépendances essentielles');
const requiredDeps = ['express', 'nodemailer', 'cors', 'body-parser', 'dotenv'];
let missingDeps = [];

requiredDeps.forEach(dep => {
    try {
        require.resolve(dep);
    } catch (e) {
        missingDeps.push(dep);
    }
});

if (missingDeps.length === 0) {
    console.log('✅ Toutes les dépendances essentielles sont installées\n');
} else {
    console.log(`❌ Dépendances manquantes: ${missingDeps.join(', ')}`);
    console.log('   Exécutez "npm install"\n');
    allTestsPassed = false;
}

// Résumé final
console.log('╔════════════════════════════════════════╗');
console.log('║                                        ║');

if (allTestsPassed) {
    console.log('║      ✅  Tous les tests réussis !  ✅   ║');
} else {
    console.log('║    ⚠️  Certains tests ont échoué  ⚠️   ║');
}

console.log('║                                        ║');
console.log('╚════════════════════════════════════════╝\n');

if (allTestsPassed) {
    console.log('🚀 Votre projet est prêt à être lancé !');
    console.log('   Démarrez le serveur avec:');
    console.log('   npm start        (mode production)');
    console.log('   npm run dev      (mode développement)\n');
} else {
    console.log('📋 Veuillez corriger les erreurs ci-dessus');
    console.log('   Consultez le README.md pour plus d\'informations\n');
}

console.log('📞 Support: Rhoujo.phanie@gmail.com');
console.log('📖 Documentation: README.md\n');

process.exit(allTestsPassed ? 0 : 1);