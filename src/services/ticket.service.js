import { TicketDAO } from "../data/DAOs/ticket.dao.js";

class TicketService {
  constructor() {
    this.ticketManager = new TicketDAO();
  }

  async createTicket(ticketData) {
    try {
      const newTicket = await this.ticketManager.createTicket(ticketData);
      return newTicket;
    } catch (error) {
      throw new Error('Se ha producido un error al imprimir el ticket');
    }
  }
}

export const ticketService = new TicketService();