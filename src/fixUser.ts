import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

async function loadServiceAccount() {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
    const serviceAccount = await import(serviceAccountPath);
    return serviceAccount.default;
  } catch (error) {
    console.error('Error al cargar serviceAccountKey.json:', error);
    process.exit(1);
  }
}

(async () => {
  const serviceAccount = await loadServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const args = process.argv.slice(2);
  const [email, role] = args;

  async function setUserRole(email: string, role: string) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { role });
      console.log(`Rol ${role} establecido para ${email}`);
    } catch (error) {
      console.error('Error al establecer rol:', error);
      process.exit(1);
    }
  }

  if (!email || !role) {
    console.error('Uso: npx ts-node src/fixUser.ts <email> <role>');
    process.exit(1);
  }

  await setUserRole(email, role);
})();