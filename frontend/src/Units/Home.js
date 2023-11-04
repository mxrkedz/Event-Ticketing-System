import Event from './Events/event.js';
import EventManager from './Events/eventManager.js';
import Ticket from './Tickets/ticket.js';
import TicketManager from './Tickets/ticketManager.js';
import AdminManager from './admins/adminManager.js';

const eventManager = new EventManager();
const ticketManager = new TicketManager();
const adminManager = new AdminManager();

// Parse the provided JSON data and create event and ticket objects
const eventData = [ /* ... (the provided JSON data) ... */ ];

eventData.forEach(eventData => {
    const tickets = eventData.tickets.map(ticketData => new Ticket(ticketData.type, ticketData.description, ticketData.price, ticketData.stock));
    const event = new Event(eventData.name, eventData.date.startDate, eventData.date.endDate, eventData.location, eventData.category, eventData.description, eventData.organizer, tickets);
    eventManager.addEvent(event);
});

// Example usage: updating ticket stock for an event

//Esports and Gaming Summit 2023
ticketManager.updateTicketStock("Esports and Gaming Summit 2023", "Iron", 750);
ticketManager.updateTicketStock("Esports and Gaming Summit 2023", "Bronze", 1000);
ticketManager.updateTicketStock("Esports and Gaming Summit 2023", "Silver", 2500);
ticketManager.updateTicketStock("Esports and Gaming Summit 2023", "Gold", 4000);
ticketManager.updateTicketStock("Esports and Gaming Summit 2023", "Platinum", 6500);

//Philippine GameDev Expo
ticketManager.updateTicketStock("Philippine GameDev Expo", "Expo", 2500);
ticketManager.updateTicketStock("Philippine GameDev Expo", "VIP", 5000);

//G Music Fest 2023
ticketManager.updateTicketStock("G Music Fest 2023", "Festival Attendee", 850);
ticketManager.updateTicketStock("G Music Fest 2023", "VIP", 2000);

// Perform other operations as needed