export {};

declare global {
  type User = {
    id: string;
    username: string;
    room: string;
  };

  type Chat = {
    username: string;
    text: string;
    time: string;
    room?: string;
  };
}
