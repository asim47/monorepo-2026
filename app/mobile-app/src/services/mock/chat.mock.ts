// Mock chat service
// This simulates API responses for chat/messaging features

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type MockConversation = {
  id: string;
  participants: string[];
  participantNames: string[];
  participantImages: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export type MockMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
};

// Mock conversations
export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: '1',
    participants: ['current-user', 'user-2'],
    participantNames: ['You', 'John Doe'],
    participantImages: ['', 'https://i.pravatar.cc/150?img=1'],
    lastMessage: 'Hey, is this still available?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 2,
  },
  {
    id: '2',
    participants: ['current-user', 'user-3'],
    participantNames: ['You', 'Jane Smith'],
    participantImages: ['', 'https://i.pravatar.cc/150?img=5'],
    lastMessage: 'Thanks for your help!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unreadCount: 0,
  },
  {
    id: '3',
    participants: ['current-user', 'user-4'],
    participantNames: ['You', 'Mike Johnson'],
    participantImages: ['', 'https://i.pravatar.cc/150?img=3'],
    lastMessage: 'When can we schedule this?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unreadCount: 1,
  },
];

// Mock messages per conversation
export const MOCK_MESSAGES: Record<string, MockMessage[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Hi! I\'m interested in this item.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      read: true,
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'user-2',
      senderName: 'John Doe',
      text: 'Hello! Yes, it\'s available. Would you like more details?',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      read: true,
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'user-2',
      senderName: 'John Doe',
      text: 'Hey, is this still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
    },
  ],
  '2': [
    {
      id: 'm4',
      conversationId: '2',
      senderId: 'user-3',
      senderName: 'Jane Smith',
      text: 'Can you help me with something?',
      timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
      read: true,
    },
    {
      id: 'm5',
      conversationId: '2',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Sure, what do you need?',
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      read: true,
    },
    {
      id: 'm6',
      conversationId: '2',
      senderId: 'user-3',
      senderName: 'Jane Smith',
      text: 'Thanks for your help!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true,
    },
  ],
  '3': [
    {
      id: 'm7',
      conversationId: '3',
      senderId: 'user-4',
      senderName: 'Mike Johnson',
      text: 'When can we schedule this?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: false,
    },
  ],
};

export const mockGetConversations = async (): Promise<MockConversation[]> => {
  await delay(800);
  return MOCK_CONVERSATIONS;
};

export const mockGetMessages = async (conversationId: string): Promise<MockMessage[]> => {
  await delay(600);
  return MOCK_MESSAGES[conversationId] || [];
};

export const mockSendMessage = async (
  conversationId: string,
  text: string
): Promise<MockMessage> => {
  await delay(400);
  
  const newMessage: MockMessage = {
    id: `m${Date.now()}`,
    conversationId,
    senderId: 'current-user',
    senderName: 'You',
    text,
    timestamp: new Date().toISOString(),
    read: false,
  };
  
  // Update mock data
  if (!MOCK_MESSAGES[conversationId]) {
    MOCK_MESSAGES[conversationId] = [];
  }
  MOCK_MESSAGES[conversationId].push(newMessage);
  
  return newMessage;
};

export const mockCreateConversation = async (
  participantId: string,
  initialMessage: string
): Promise<{ conversation: MockConversation; message: MockMessage }> => {
  await delay(700);
  
  const newConversationId = `conv-${Date.now()}`;
  
  const conversation: MockConversation = {
    id: newConversationId,
    participants: ['current-user', participantId],
    participantNames: ['You', 'New User'],
    participantImages: ['', 'https://i.pravatar.cc/150?img=10'],
    lastMessage: initialMessage,
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
  };
  
  const message: MockMessage = {
    id: `m${Date.now()}`,
    conversationId: newConversationId,
    senderId: 'current-user',
    senderName: 'You',
    text: initialMessage,
    timestamp: new Date().toISOString(),
    read: false,
  };
  
  MOCK_CONVERSATIONS.unshift(conversation);
  MOCK_MESSAGES[newConversationId] = [message];
  
  return { conversation, message };
};
