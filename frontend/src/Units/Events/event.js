class Event {
    constructor(name, startDate, endDate, location, category, description, organizer, tickets) {
        this.name = name;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.location = location;
        this.category = category;
        this.description = description;
        this.organizer = organizer;
        this.tickets = tickets;
    }
}

export default Event;