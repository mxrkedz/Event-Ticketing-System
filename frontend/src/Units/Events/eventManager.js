const Event = require('./event'); // Import the Mongoose Event model

class EventManager {
    async addEvent(eventData) {
            try {
                const event = new Event(eventData);
                await event.save();
                return event;
            } catch (error) {
                throw error;
            }
        }
        async addEvent(eventData) {
            try {
                const event = new Event(eventData);
                await event.save();
                return event;
            } catch (error) {
                throw error;
            }
        }
    
        async updateEvent(eventId, updatedEventData) {
            try {
                const event = await Event.findById(eventId);
                if (!event) {
                    throw new Error("Event not found");
                }
    
                // Update event properties based on updatedEventData
                if (updatedEventData.name) {
                    event.name = updatedEventData.name;
                }
                if (updatedEventData.date) {
                    event.date = updatedEventData.date;
                }
                if (updatedEventData.location) {
                    event.location = updatedEventData.location;
                }
                if (updatedEventData.category) {
                    event.category = updatedEventData.category;
                }
                if (updatedEventData.description) {
                    event.description = updatedEventData.description;
                }
                if (updatedEventData.organizer) {
                    event.organizer = updatedEventData.organizer;
                }
                if (updatedEventData.images) {
                    event.images = updatedEventData.images;
                }
                if (updatedEventData.tickets) {
                    event.tickets = updatedEventData.tickets;
                }
    
                await event.save();
                return event;
            } catch (error) {
                throw error;
            }
        }

         async getEventById(eventId) {
        try {
            const event = await Event.findById(eventId);
            if (!event) {
                throw new Error("Event not found");
            }
            return event;
        } catch (error) {
            throw error;
        }
    }

    async getAllEvents() {
        try {
            const events = await Event.find();
            return events;
        } catch (error) {
            throw error;
        }
    }

    async getEventsByCategory(category) {
        try {
            const events = await Event.find({ category });
            return events;
        } catch (error) {
            throw error;
        }
    }

    async deleteEventById(eventId) {
        try {
            const event = await Event.findByIdAndRemove(eventId);
            if (!event) {
                throw new Error("Event not found");
            }
            return event;
        } catch (error) {
            throw error;
        }
    }

    async searchEventsByKeyword(keyword) {
        try {
            const events = await Event.find({ $text: { $search: keyword } });
            return events;
        } catch (error) {
            throw error;
        }
    }

    async updateEventOrganizer(eventId, newOrganizer) {
        try {
            const event = await Event.findById(eventId);
            if (!event) {
                throw new Error("Event not found");
            }
    
            event.organizer = newOrganizer;
            await event.save();
            return event;
        } catch (error) {
            throw error;
        }
    }

    // ... (other methods)

    // Implement more methods as per your application needs
}

module.exports = EventManager;