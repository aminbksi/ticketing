import mongoose from "mongoose";

interface TicketInterface {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(ticket: TicketInterface): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (ticket: TicketInterface) => {
  return new Ticket(ticket);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
