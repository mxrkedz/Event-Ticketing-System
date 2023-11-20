const Order = require("../models/order");
const Event = require("../models/event");
const sendEmail = require("../utils/sendEmail");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const sendOrderConfirmationEmail = async (userEmail, orderId) => {
  const orderConfirmationUrl = `http://localhost:4001/api/v1/order/${orderId}`;

  const message = `<h1>Thank you for choosing Ticket Tekcit!</h1>
   <p>Your order has been confirmed, and we're thrilled to be part of your event experience. You can review the details of your order by clicking on the link below:</p>
  <br/>
  <a href=${orderConfirmationUrl} target="_blank">Review Order Details</a>
  <br/>
  <p>We appreciate your trust in us and look forward to providing you with a seamless event experience.</p>
  <br/>
  <p>Best Regards,</p>
  <p>The Ticket Tekcit Team</p>`;

  try {
    // Fetch the order details
    const order = await Order.findById(orderId).populate(
      "orderItems.event",
      "eventName"
    );

    if (!order) {
      console.error(`Order not found for ID: ${orderId}`);
      return;
    }

    // Create a PDF document
    const pdfDoc = new PDFDocument();
    const pdfPath = "order_confirmation.pdf";
    pdfDoc.pipe(fs.createWriteStream(pdfPath));
    pdfDoc
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Order Details", { align: "center" });
    pdfDoc.moveDown(0.5);
    pdfDoc.text(`Order ID: ${orderId}`);
    pdfDoc.text(`Order Items:`);

    // Loop through order items and add to PDF
    order.orderItems.forEach((item, index) => {
      pdfDoc.text(`  Item ${index + 1}:`);
      pdfDoc.text(`    Name: ${item.name}`);
      pdfDoc.text(`    Quantity: ${item.quantity}`);
      pdfDoc.text(`    Price: ${item.price}`);
    });

    pdfDoc.text(`Total Price: ${order.totalPrice}`);
    pdfDoc.text(`Paid At: ${order.paidAt}`);
    pdfDoc.end();

    await sendEmail({
      email: userEmail,
      subject: "Ticket Tekcit Order Confirmation",
      message,
      attachments: [
        {
          filename: "order_confirmation.pdf",
          path: pdfPath,
        },
      ],
    });

    console.log(`Order confirmation email sent to: ${userEmail}`);
  } catch (error) {
    console.error(`Error sending order confirmation email: ${error.message}`);
  }
};

exports.newOrder = async (req, res, next) => {
  try {
    const { orderItems, itemsPrice, taxPrice, totalPrice, paymentInfo } =
      req.body;

    const order = await Order.create({
      orderItems,
      itemsPrice,
      taxPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // Send order confirmation email to the user
    await sendOrderConfirmationEmail(req.user.email, order._id);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(`Error creating new order: ${error.message}`);
    res
      .status(500)
      .json({ error: `Error creating new order: ${error.message}` });
  }
};

exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: `No Event Order Found with this ID` });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(`Error fetching single order: ${error.message}`);
    // You can choose to handle the error in a more detailed manner or send a specific error response.
    res
      .status(500)
      .json({ error: `Error fetching single order: ${error.message}` });
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
    res
      .status(500)
      .json({ error: `Error fetching user's orders: ${error.message}` });
  }
};

exports.allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (error) {
    console.error(`Error fetching all orders: ${error.message}`);
    res
      .status(500)
      .json({ error: `Error fetching all orders: ${error.message}` });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: `Order not found` });
    }

    if (order.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({ message: `You have already delivered this order` });
    }

    order.orderItems.forEach(async (item) => {
      await updateStock(item.event, item.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(`Error updating order: ${error.message}`);
    res.status(500).json({ error: `Error updating order: ${error.message}` });
  }
};

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
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while deleting the order.",
    });
  }
};
