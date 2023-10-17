import Ticket from "../data/mongoDB/models/ticket.models.js";

async function generateUniqueCode() {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = generateRandomCode(); 

    const existingTicket = await Ticket.findOne({ code: uniqueCode });
    if (!existingTicket) {
      isUnique = true; 
    }
  }
  return uniqueCode;
}

function generateRandomCode() {

  const timestamp = new Date().getTime().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5); 

  return `CODE-${timestamp}-${randomPart}`;
}

export { generateUniqueCode };
