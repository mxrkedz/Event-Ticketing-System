const Event = require('../models/event')
const Order = require('../models/order')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

exports.newEvent = async (req, res, next) => {
	// console.log(req.body);
	try {
		if(req.files){
			req.body.images = req.files
		}
	  if (!req.body.images) {
		return res.status(400).json({
		  success: false,
		  message: 'Images are required for creating a new event',
		});
	  }
  
	  let imagesLinks = [];
  
	  for (let i = 0; i < req.body.images.length; i++) {
		let imageDataUri = req.body.images[i].path; //tanggalin yung .path pag front end na
		try {
		  const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
			folder: 'eventTickets/products',
			width: 150,
			crop: 'scale',
		  });
  
		  imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url,
		  });
		} catch (error) {
		  console.error(`Error uploading image to Cloudinary: ${error}`);
		}
	  }
  
	  req.body.images = imagesLinks;
	  req.body.user = req.user.id;
  
	//   const event = await Event.create(req.body);
	const { name, 
		startDate, 
		endDate, 
		location, 
		category, 
		description, 
		organizer, 
		price,
		stock} = req.body;

		const event = await Event.create({
			name,
			startDate,
			endDate,
			location,
			category,
			description,
			organizer,
			price,
			stock,
			images: imagesLinks
		})
	  if (!event) {
		return res.status(400).json({
		  success: false,
		  message: 'Event not created',
		});
	  }
  
	  res.status(201).json({
		success: true,
		event,
	  });
	} catch (error) {
	  console.error(`Error creating a new event: ${error}`);
	  // You can choose to handle the error in a more detailed manner or send a specific error response.
	  res.status(500).json({
		success: false,
		error: `Error creating a new event: ${error}`,
	  });
	}
  };
  exports.getEvents = async (req, res, next) => {
	try {
	  const resPerPage = 6;
	  const eventsCount = await Event.countDocuments();
	  const apiFeatures = new APIFeatures(Event.find(), req.query).search().filter();
  
	  apiFeatures.pagination(resPerPage);
	  const events = await apiFeatures.query;
	  const filteredEventsCount = events.length;
  
	  if (!events) {
		return res.status(404).json({
			success: false,
			message: 'Events not found'
		})
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
		  message: 'Event not found'
		});
	  }
  
	  res.status(200).json({
		success: true,
		event
	  });
	} catch (error) {
	  console.error(`Error fetching single event: ${error.message}`);
	  // You can choose to handle the error in a more detailed manner or send a specific error response.
	  res.status(500).json({ error: `Error fetching single event: ${error.message}` });
	}
};
exports.updateEvent = async (req, res, next) => {
	try {
	  let event = await Event.findById(req.params.id);
  
	  if (!event) {
		return res.status(404).json({
		  success: false,
		  message: 'Event not found'
		});
	  }
  
	  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	  });
  
	  if (!event) {
		return res.status(404).json({
		  success: false,
		  message: 'Event not updated'
		});
	  }
  
	  res.status(200).json({
		success: true,
		event
	  });
	} catch (error) {
	  console.error(`Error updating event: ${error.message}`);
	  res.status(500).json({ error: `Error updating event: ${error.message}` });
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
		  message: 'Event not found'
		});
	  }
  
	  res.status(200).json({
		success: true,
		message: 'Event deleted'
	  });
	} catch (error) {
	  console.error(`Error deleting event: ${error.message}`);
	  res.status(500).json({ error: `Error deleting event: ${error.message}` });
	}
};
  

exports.updateProduct = async (req, res, next) => {
	let product = await Product.findById(req.params.id);
	// console.log(req.body)
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}
	let images = []

	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}
	if (images !== undefined) {
		// Deleting images associated with the product
		for (let i = 0; i < product.images.length; i++) {
			const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
		}
	}
	let imagesLinks = [];
	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: 'products'
		});
		imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url
		})

	}
	req.body.images = imagesLinks
	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	if (!product)
		return res.status(400).json({
			success: false,
			message: 'Product not updated'
		})
	// console.log(product)
	return res.status(200).json({
		success: true,
		product
	})

}

exports.eventSales = async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$itemsPrice" }

            },

        },
    ])
    console.log(totalSales)
    const sales = await Order.aggregate([
        { $project: { _id: 0, "orderItems": 1, totalPrice: 1 } },
        { $unwind: "$orderItems" },
        {
            $group: {
                _id: { event: "$orderItems.name" },
                total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            },
        },
    ])
	// return console.log(sales)

    if (!totalSales) {
		return res.status(404).json({
			message: 'error sales'
		})

    }
    if (!sales) {
		return res.status(404).json({
			message: 'error sales'
		})

    }

    let totalPercentage = {}
    totalPercentage = sales.map(item => {

        // console.log( ((item.total/totalSales[0].total) * 100).toFixed(2))
        percent = Number (((item.total/totalSales[0].total) * 100).toFixed(2))
        total =  {
            name: item._id.event,
            percent
        }
        return total
    }) 
    // return console.log(totalPercentage)
    res.status(200).json({
        success: true,
        totalPercentage,
        sales,
        totalSales
    })
}