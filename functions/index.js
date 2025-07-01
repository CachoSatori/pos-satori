/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions/v2");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
setGlobalOptions({ maxInstances: 10 });

// Cloud Function: Send FCM notification when a new order is created
exports.notifyNewOrder = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data?.data();
  if (!order) {
    logger.error("No order data found in event.");
    return;
  }

  // Customize notification payload
  const payload = {
    notification: {
      title: "Nueva orden recibida",
      body: `Mesa #${order.tableId} - ${order.items?.length || 0} productos`,
      click_action: "FLUTTER_NOTIFICATION_CLICK", // or your app's route
    },
    data: {
      orderId: event.params.orderId,
      tableId: order.tableId || "",
      status: order.status || "pending",
    },
  };

  try {
    // Send to a topic (e.g., 'orders') or to specific tokens
    const response = await admin.messaging().sendToTopic("orders", payload);
    logger.info("Notificación enviada a topic 'orders':", response);
  } catch (error) {
    logger.error("Error enviando notificación FCM:", error);
  }
});
