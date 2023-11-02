const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    date: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Convention', 'Expo', 'Music'],
    },
    description: {
        type: String,
        required: true,
    },
    organizer: {
        type: String,
        required: true,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    tickets: [
        {
            type: {
                type: String,
                required: true,
                trim: true,
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            stock: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model('Event', eventSchema);
