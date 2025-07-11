const cron = require('node-cron');
const axios = require('axios');
const Order = require('./models/orderModel'); // Adjust path as needed

// Test Delhivery API credentials (replace with real keys later)
const DELHIVERY_API_KEY = 'TEST-API-KEY';
const DELHIVERY_API_URL = 'https://track.delhivery.com/api/v1/packages/json/';

const mapDelhiveryStatus = (delhiveryStatus) => {
  if (!delhiveryStatus) return 'pending';
  const status = delhiveryStatus.toLowerCase();
  if (status.includes('delivered')) return 'delivered';
  if (status.includes('in transit')) return 'shipped';
  if (status.includes('pending')) return 'pending';
  if (status.includes('cancelled')) return 'cancelled';
  if (status.includes('returned')) return 'returned';
  return 'processing';
};

const fetchAndUpdateOrderStatus = async (order) => {
  if (!order.trackingId) return;
  try {
    const res = await axios.get(`${DELHIVERY_API_URL}?waybill=${order.trackingId}`, {
      headers: {
        'Authorization': `Token ${DELHIVERY_API_KEY}`
      }
    });
    // Delhivery's response structure may vary; adjust as needed
    const delhiveryStatus = res.data?.ShipmentData?.[0]?.Shipment?.Status?.Status;
    const mappedStatus = mapDelhiveryStatus(delhiveryStatus);

    if (order.orderStatus !== mappedStatus) {
      order.orderStatus = mappedStatus;
      await order.save();
      console.log(`Order ${order._id} status updated to ${mappedStatus}`);
    }
  } catch (err) {
    console.error(`Failed to sync order ${order._id}:`, err.message);
  }
};

// Run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('Running Delhivery order status sync...');
  const orders = await Order.find({
    trackingId: { $exists: true, $ne: null },
    orderStatus: { $nin: ['delivered', 'cancelled', 'returned'] }
  });
  for (const order of orders) {
    await fetchAndUpdateOrderStatus(order);
  }
});

// Export for manual sync endpoint
module.exports = { fetchAndUpdateOrderStatus };
