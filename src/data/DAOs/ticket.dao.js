import Ticket from "../mongoDB/models/ticket.models.js";

class TicketDAO {
  async createTicket(ticketData) {
    const newTicket = new Ticket(ticketData);
    await newTicket.save();
    return newTicket;
  }
}

export { TicketDAO };