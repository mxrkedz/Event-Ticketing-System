const Order = require("../models/order");
const Event = require("../models/event");
const sendEmail = require("../utils/sendEmail");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const sendOrderConfirmationEmail = async (userEmail, orderId) => {
  const orderConfirmationUrl = `http://localhost:4001/api/v1/order/${orderId}/confirm`;

  const message = `<h1>New Order Confirmation!</h1>
  <h3>Order # ${orderId}</h3>
  <p>We're excited to inform you that a new order has been placed. You can confirm the order by clicking on the link below:</p>
  <br/>
  <a href="${orderConfirmationUrl}" target="_blank">Confirm Order</a>
  <br/>
  <p>Please find the order details attached to this email for your reference.</p>`;

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
const sendTransactionCompleteEmail = async (userEmail, orderId) => {
  const message = `<h1>Order Confirmed!</h1>
  <h3>Order # ${orderId}</h3>
  <p>We're pleased to inform you that your order has been confirmed and is currently being processed.</p>
  <br/>
  <p>Thank you for choosing Ticket Tekcit. We appreciate your business and look forward to providing you with a seamless experience.</p>
  <br/>
  <p>Best Regards,</p>
  <p>The Ticket Tekcit Team</p>`;

  try {
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
          filename: "order_details.pdf",
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
    const {
      orderItems,
      itemsPrice,
      taxPrice,
      totalPrice,
      paymentInfo,
      shippingInfo,
    } = req.body;

    const order = await Order.create({
      orderItems,
      itemsPrice,
      taxPrice,
      totalPrice,
      paymentInfo,
      shippingInfo,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // Send order confirmation email to the user
    // req.user.email
    await sendOrderConfirmationEmail("tickettekcit@admin.com", order._id);

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
exports.confirmOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const users = await Order.findById(orderId).populate("user");
    const userEmail = users.user.email;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: "Processing" }, // Assuming 'status' is the field in your Order model representing order status
      { new: true } // To return the updated order after the update is applied
    );
    const order = await Order.findById(orderId);
    // req.user.email
    await sendTransactionCompleteEmail(userEmail, orderId);
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ success: false, error: "Failed to confirm order" });
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
exports.totalOrders = async (req, res, next) => {
  const totalOrders = await Order.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]);
  if (!totalOrders) {
    return res.status(404).json({
      message: "error total orders",
    });
  }
  res.status(200).json({
    success: true,
    totalOrders,
  });
};
exports.totalSales = async (req, res, next) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  if (!totalSales) {
    return res.status(404).json({
      message: "error total sales",
    });
  }
  res.status(200).json({
    success: true,
    totalSales,
  });
};
exports.customerSales = async (req, res, next) => {
  const customerSales = await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    // {
    //     $group: {
    //         _id: "$user",
    //         total: { $sum: "$totalPrice" },
    //     }
    // },

    { $unwind: "$userDetails" },
    // {
    //     $group: {
    //         _id: "$user",
    //         total: { $sum: "$totalPrice" },
    //         doc: { "$first": "$$ROOT" },

    //     }
    // },

    // {
    //     $replaceRoot: {
    //         newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
    //     },
    // },
    {
      $group: {
        _id: "$userDetails.name",
        total: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        "userDetails.name": 1,
        total: 1,
      },
    },
    { $sort: { total: 1 } },
  ]);
  console.log(customerSales);
  if (!customerSales) {
    return res.status(404).json({
      message: "error customer sales",
    });
  }
  // return console.log(customerSales)
  res.status(200).json({
    success: true,
    customerSales,
  });
};
exports.salesPerMonth = async (req, res, next) => {
  const salesPerMonth = await Order.aggregate([
    {
      $group: {
        // _id: {month: { $month: "$paidAt" } },
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
        },
        total: { $sum: "$totalPrice" },
      },
    },

    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                ,
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                " Sept",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id.month"],
            },
          },
        },
      },
    },
    { $sort: { "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: 1,
        total: 1,
      },
    },
  ]);
  if (!salesPerMonth) {
    return res.status(404).json({
      message: "error sales per month",
    });
  }
  // return console.log(customerSales)
  res.status(200).json({
    success: true,
    salesPerMonth,
  });
};
