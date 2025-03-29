
import { Channel, Message, Section, User } from "@/types/chat";

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Acme Team",
    avatar: "/lovable-uploads/4184efd4-0e69-4a98-b2e4-59ef0a1dbe06.png",
    status: "online",
  },
  {
    id: "user2",
    name: "Zoe Maxwell",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "online",
  },
  {
    id: "user3",
    name: "Lisa Dawson",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "away",
  },
  {
    id: "user4",
    name: "Lee Hao",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "online",
  },
];

export const mockSections: Section[] = [
  {
    id: "nav",
    title: "Navigation",
    items: [
      { id: "unreads", name: "Unreads", type: "direct" },
      { id: "threads", name: "Threads", type: "direct" },
      { id: "drafts", name: "Drafts & sent", type: "direct" },
    ],
  },
  {
    id: "channels",
    title: "Channels",
    items: [
      { id: "announcements", name: "announcements", type: "channel" },
      { id: "design-crit", name: "design-crit", type: "channel", isPrivate: true },
      { id: "media-and-pr", name: "media-and-pr", type: "channel" },
      { id: "social-media", name: "social-media", type: "channel" },
      { id: "team-marketing", name: "team-marketing", type: "channel" },
    ],
  },
  {
    id: "direct",
    title: "Direct messages",
    items: [
      { id: "dm-lee", name: "Lee Hao", type: "direct" },
    ],
  },
];

export const mockCurrentChannel: Channel = {
  id: "social-media",
  name: "social-media",
  type: "channel",
};

export const mockMessages: Record<string, Message[]> = {
  "social-media": [
    {
      id: "msg1",
      user: mockUsers[0],
      content: "Event starting in 15 minutes:",
      timestamp: "12:45 PM",
      isEvent: true,
      eventDetails: {
        type: "meeting",
        details: "Team Status Meeting 📝",
        time: "Today from 1:00 PM to 1:30 PM"
      }
    },
    {
      id: "msg2",
      user: mockUsers[1],
      content: "Today @all will join our team huddle to provide updates on the launch. If you have questions, bring 'em. See you all soon!",
      timestamp: "12:55 PM",
    },
    {
      id: "msg3",
      user: mockUsers[2],
      content: "A huddle happened",
      timestamp: "1:00 PM",
      isEvent: true,
      eventDetails: {
        type: "huddle",
        details: "Lisa Dawson and 5 others were in the huddle for 28 minutes."
      }
    },
    {
      id: "msg4",
      user: mockUsers[3],
      content: "Please add any other notes from our sync today!",
      timestamp: "1:45 PM",
      attachments: [
        {
          id: "att1",
          type: "file",
          name: "1/9 Meeting notes",
          url: "#",
          previewUrl: "Canvas",
        },
      ],
    },
  ],
  "unreads": [],
  "threads": [],
  "drafts": [],
  "announcements": [],
  "design-crit": [],
  "media-and-pr": [],
  "team-marketing": [],
  "dm-lee": [],
};
