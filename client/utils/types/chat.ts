
// TODO might share these types across the application to make it easier

export interface Message
{
  sender: string; // id of the sender
  content: string;
  // TODO might add timestamp
}

export interface Channel
{
  id : string;
  users: string[]; // list of ids
  name: string,
  admin: string, // id of admin
  messages: Message[];
}


