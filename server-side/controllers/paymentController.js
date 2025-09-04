import { Cashfree } from "cashfree-pg"; 

// Cashfree config
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // PRODUCTION me change karo

export const createOrderController = async (req, res) => {
  try {
    const { orderId, orderAmount, customerId, customerEmail, customerPhone } = req.body;

    const request = {
      order_amount: orderAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
    };

    // Cashfree order create
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);

    if (!response || !response.data) {
      return res.status(500).json({ success: false, message: "Cashfree order creation failed" });
    }

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Cashfree error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Server error in payment" });
  }
};
