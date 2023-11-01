const Event = require('../models/event')
const APIFeatures = require('../utils/apiFeatures')
exports.newEvent = async (req, res, next) => {
    const eventData = req.body;

    try {
        // Insert the event data into the database
        const event = await Event.create(eventData);

        res.status(201).json({
            success: true,
            event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
exports.getEvents = async (req, res, next) => {
    try {
        const resPerPage = 4;
		const eventsCount = await Event.countDocuments();
		const apiFeatures = new APIFeatures(Event.find(),req.query).search().filter(); 

		// const products = await Product.find();
		apiFeatures.pagination(resPerPage);
		const events = await apiFeatures.query;
		let filteredEventsCount = events.length;
		res.status(200).json({
		success: true,
		filteredEventsCount,
		eventsCount,
		events,
		resPerPage,
	});
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
exports.getSingleEvent = async (req, res, next) => {
	const event = await Event.findById(req.params.id);
	if (!event) {
		return res.status(404).json({
			success: false,
			message: 'Event not found'
		})
	}
	res.status(200).json({
		success: true,
		event
	})
}
exports.updateEvent = async (req, res, next) => {
	let event = await Event.findById(req.params.id);
	console.log(req.body)
	if (!event) {
		return res.status(404).json({
			success: false,
			message: 'Event not found'
		})
	}
	event = await Event.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	})
	if (!event) {
		return res.status(404).json({
			success: false,
			message: 'Event not updated'
		})
	}
	res.status(200).json({
		success: true,
		event
	})
}
exports.getAdminEvents = async (req, res, next) => {
    try {
        // Query the database to get all events
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
	const event = await Event.findByIdAndDelete(req.params.id);
	if (!event) {
		return res.status(404).json({
			success: false,
			message: 'Event not found'
		})
	}
	// await event.remove();
	res.status(200).json({
		success: true,
		message: 'Product deleted'
	})
}

// exports.newProduct = async (req, res, next) => {

// 	let images = []
// 	if (typeof req.body.images === 'string') {
// 		images.push(req.body.images)
// 	} else {
// 		images = req.body.images
// 	}

// 	let imagesLinks = [];

// 	for (let i = 0; i < images.length; i++) {
// 		let imageDataUri = images[i]
// 		// console.log(imageDataUri)
// 		try {
// 			const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
// 				folder: 'products',
// 				width: 150,
// 				crop: "scale",
// 			});

// 			imagesLinks.push({
// 				public_id: result.public_id,
// 				url: result.secure_url
// 			})

// 		} catch (error) {
// 			console.log(error)
// 		}

// 	}

// 	req.body.images = imagesLinks
// 	req.body.user = req.user.id;

// 	const product = await Product.create(req.body);
// 	if (!product)
// 		return res.status(400).json({
// 			success: false,
// 			message: 'Product not created'
// 		})
// 	res.status(201).json({
// 		success: true,
// 		product
// 	})
// }


// exports.updateProduct = async (req, res, next) => {
// 	let product = await Product.findById(req.params.id);
// 	// console.log(req.body)
// 	if (!product) {
// 		return res.status(404).json({
// 			success: false,
// 			message: 'Product not found'
// 		})
// 	}
// 	let images = []

// 	if (typeof req.body.images === 'string') {
// 		images.push(req.body.images)
// 	} else {
// 		images = req.body.images
// 	}
// 	if (images !== undefined) {
// 		// Deleting images associated with the product
// 		for (let i = 0; i < product.images.length; i++) {
// 			const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
// 		}
// 	}
// 	let imagesLinks = [];
// 	for (let i = 0; i < images.length; i++) {
// 		const result = await cloudinary.v2.uploader.upload(images[i], {
// 			folder: 'products'
// 		});
// 		imagesLinks.push({
// 			public_id: result.public_id,
// 			url: result.secure_url
// 		})

// 	}
// 	req.body.images = imagesLinks
// 	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
// 		new: true,
// 		runValidators: true,
// 		useFindandModify: false
// 	})
// 	if (!product)
// 		return res.status(400).json({
// 			success: false,
// 			message: 'Product not updated'
// 		})
// 	// console.log(product)
// 	return res.status(200).json({
// 		success: true,
// 		product
// 	})
// }