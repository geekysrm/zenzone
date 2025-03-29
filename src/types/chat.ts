
export type User = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  status?: "online" | "offline" | "away";
};

export type Channel = {
  id: string;
  name: string;
  type: "channel" | "direct";
  unreadCount?: number;
  isPrivate?: boolean;
};

export type Message = {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  reactions?: Reaction[];
  attachments?: Attachment[];
  isEvent?: boolean;
  eventDetails?: {
    type: string;
    details: string;
    time?: string;
  };
};

export type Reaction = {
  emoji: string;
  count: number;
  users: string[];
};

export type Attachment = {
  id: string;
  type: "image" | "file" | "link";
  name: string;
  url: string;
  previewUrl?: string;
};

export type Section = {
  id: string;
  title: string;
  items: Channel[];
};
