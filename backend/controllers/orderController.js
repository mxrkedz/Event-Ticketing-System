const Order = require('../models/order');
const Event = require('../models/event');
const sendEmail = require('../utils/sendEmail')

const sendOrderConfirmationEmail = async (userEmail, orderId) => {
  const orderConfirmationUrl = `http://localhost:4001/api/v1/order/${orderId}`;

  const message = `Hello,\n\nThank you for your order! Your order has been confirmed. You can view your order details by clicking on the following link:\n\n${orderConfirmationUrl}\n\nIf you have any questions or concerns, please feel free to contact us.\n\nThank you for choosing TicketTricky!\n\nSincerely,\nThe Team`;

  try {
    await sendEmail({
      email: userEmail,
      subject: 'Ticket Tekcit Order Confirmation',
      message
    });

    console.log(`Order confirmation email sent to: ${userEmail}`);
  } catch (error) {
    console.error(`Error sending order confirmation email: ${error.message}`);
    // Handle the error, you can choose to log it or send a response to the client.
  }
};

exports.newOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      itemsPrice,
      taxPrice,
      totalPrice,
      paymentInfo
    } = req.body;

    const order = await Order.create({
      orderItems,
      itemsPrice,
      taxPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id
    });

    // Send order confirmation email to the user
    await sendOrderConfirmationEmail(req.user.email, order._id);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error(`Error creating new order: ${error.message}`);
    res.status(500).json({ error: `Error creating new order: ${error.message}` });
  }
};

  
exports.getSingleOrder = async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate('user', 'name email');
  
      if (!order) {
        return res.status(404).json({ message: `No Event Order Found with this ID` });
      }
  
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(`Error fetching single order: ${error.message}`);
      // You can choose to handle the error in a more detailed manner or send a specific error response.
      res.status(500).json({ error: `Error fetching single order: ${error.message}` });
    }
  };
  
exports.myOrders = async (req, res, next) => {
    try {
      const orders = await Order.find({ user: req.user.id });
  
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error(`Error fetching user's orders: ${error.message}`);
      res.status(500).json({ error: `Error fetching user's orders: ${error.message}` });
    }
  };
  
exports.allOrders = async (req, res, next) => {
    try {
      const orders = await Order.find();
  
      let totalAmount = 0;
  
      orders.forEach(order => {
        totalAmount += order.totalPrice;
      });
  
      res.status(200).json({
        success: true,
        totalAmount,
        orders,
      });
    } catch (error) {
      console.error(`Error fetching all orders: ${error.message}`);
      res.status(500).json({ error: `Error fetching all orders: ${error.message}` });
    }
  };
  
exports.updateOrder = async (req, res, next) => {
    try{
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ message: `Order not found` });
          }
      
          if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ message: `You have already delivered this order` });
          }

        order.orderItems.forEach(async item => {
            await updateStock(item.event, item.quantity)
        })

        order.orderStatus = req.body.status
        order.deliveredAt = Date.now()
        await order.save()

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error(`Error updating order: ${error.message}`);
        res.status(500).json({ error: `Error updating order: ${error.message}` });

}
}

async function updateStock(id, quantity) {
  try {
    const event = await Event.findById(id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found.`);
    }

    event.stock = event.stock - quantity;
    await event.save({ validateBeforeSave: false });

  } catch (error) {
    console.error(`Error updating stock for Event ID ${id}: ${error.message}`);
  }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: `No Order found with this ID` });
        }

        await order.remove();

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'An error occurred while deleting the order.'
        });
    }
}
