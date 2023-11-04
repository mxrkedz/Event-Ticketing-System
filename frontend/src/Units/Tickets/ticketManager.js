class TicketManager {
    constructor() {
        this.tickets = [];
    }

    updateTicketStock(eventName, ticketType, newStock) {
        const eventIndex = this.tickets.findIndex(event => event.name === eventName);
        if (eventIndex !== -1) {
            const ticketIndex = this.tickets[eventIndex].tickets.findIndex(ticket => ticket.type === ticketType);
            if (ticketIndex !== -1) {
                this.tickets[eventIndex].tickets[ticketIndex].stock = newStock;
            }
        }
    }
}

export default TicketManager;