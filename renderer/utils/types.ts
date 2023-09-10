export type Message = {
  sender: string;
  content: string;
  time: number;
}

export type Chat = {
  title: string;
  lastMessage: Message;
}