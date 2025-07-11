// @ts-nocheck
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

function loadServiceAccount() {
  try {
    const serviceAccountPath =
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
    const resolvedPath = path.resolve(serviceAccountPath);
    console.log(
      'Intentando cargar serviceAccountKey.json desde:',
      resolvedPath
    );
    const json = fs.readFileSync(resolvedPath, 'utf-8');
    return JSON.parse(json);
  } catch (error) {
    console.error('Error al cargar serviceAccountKey.json:', error);
    process.exit(1);
  }
}

(async () => {
  const serviceAccount = loadServiceAccount();
  if (
    !serviceAccount ||
    !serviceAccount.private_key ||
    !serviceAccount.client_email
  ) {
    console.error(
      'El archivo serviceAccountKey.json no es válido o le faltan campos requeridos.'
    );
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const args = process.argv.slice(2);
  const [email, role = 'admin'] = args;

  async function setUserRole(email, role) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { role });
      console.log(`Rol ${role} establecido para ${email}`);
    } catch (error) {
      console.error('Error al establecer rol:', error);
      process.exit(1);
    }
  }

  if (!email) {
    console.error('Uso: node fixUser.cjs <email> [role]');
    process.exit(1);
  }

  await setUserRole(email, role);
})();
