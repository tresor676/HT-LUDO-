// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;

  // Vérifier que c'est l'admin
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError('permission-denied', 'Non autorisé');
  }

  // Supprimer Auth
  await admin.auth().deleteUser(uid);

  // Supprimer Firestore
  await admin.firestore().doc(`users/${uid}`).delete();

  return { success: true };
});

exports.disableUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;

  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError('permission-denied', 'Non autorisé');
  }

  // Désactiver temporairement
  await admin.auth().updateUser(uid, { disabled: true });

  return { success: true };
});

exports.enableUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;

  if (!context.auth || !context.auth.token.role === "admin") {
    throw new functions.https.HttpsError('permission-denied', 'Non autorisé');
  }

  // Réactiver
  await admin.auth().updateUser(uid, { disabled: false });

  return { success: true };
});
