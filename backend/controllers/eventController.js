const Event = require("../models/event");
const Order = require("../models/order");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newEvent = async (req, res, next) => {
  try {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      let imageDataUri = images[i];
      try {
        const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
          folder: "event",
          width: 150,
          crop: "scale",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.log(`Error uploading image to Cloudinary: ${error}`);
        return res.status(500).json({
          success: false,
          error: `Error uploading image to Cloudinary: ${error.message}`,
        });
      }
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const event = await Event.create(req.body);
    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not created",
      });
    }

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.log(`Unexpected error in newEvent: ${error}`);
    return res.status(500).json({
      success: false,
      error: `Unexpected error: ${error.message}`,
    });
  }
};
exports.getEvents = async (req, res, next) => {
  try {
    const resPerPage = 6;
    const eventsCount = await Event.countDocuments();
    const apiFeatures = new APIFeatures(Event.find(), req.query)
      .search()
      .filter()
      .category()
      .pagination(resPerPage);

    apiFeatures.pagination(resPerPage);
    const events = await apiFeatures.query;
    const filteredEventsCount = events.length;

    if (!events) {
      return res.status(404).json({
        success: false,
        message: "Events not found",
      });
    }

    res.status(200).json({
      success: true,
      filteredEventsCount,
      eventsCount,
      events,
      resPerPage,
    });
  } catch (error) {
    console.error(`Error fetching events: ${error.message}`);
    // You can choose to handle the error in a more detailed manner or send a specific error response.
    res.status(500).json({
      success: false,
      error: `Error fetching events: ${error.message}`,
    });
  }
};
exports.getSingleEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(`Error fetching single event: ${error.message}`);
    // You can choose to handle the error in a more detailed manner or send a specific error response.
    res
      .status(500)
      .json({ error: `Error fetching single event: ${error.message}` });
  }
};
exports.getAdminEvents = async (req, res, next) => {
  try {
    const events = await Event.find();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    console.error(`Error deleting event: ${error.message}`);
    res.status(500).json({ error: `Error deleting event: ${error.message}` });
  }
};
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      // Deleting images associated with the event
      for (let i = 0; i < event.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          event.images[i].public_id
        );
      }
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "events",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false, // Fix typo here (useFindAndModify instead of useFindandModify)
    });

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not updated",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.eventSales = async (req, res, next) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$itemsPrice" },
      },
    },
  ]);
  console.log(totalSales);
  const sales = await Order.aggregate([
    { $project: { _id: 0, orderItems: 1, totalPrice: 1 } },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: { event: "$orderItems.name" },
        total: {
          $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
        },
      },
    },
  ]);
  // return console.log(sales)

  if (!totalSales) {
    return res.status(404).json({
      message: "error sales",
    });
  }
  if (!sales) {
    return res.status(404).json({
      message: "error sales",
    });
  }

  let totalPercentage = {};
  totalPercentage = sales.map((item) => {
    // console.log( ((item.total/totalSales[0].total) * 100).toFixed(2))
    percent = Number(((item.total / totalSales[0].total) * 100).toFixed(2));
    total = {
      name: item._id.event,
      percent,
    };
    return total;
  });
  // return console.log(totalPercentage)
  res.status(200).json({
    success: true,
    totalPercentage,
    sales,
    totalSales,
  });
};
