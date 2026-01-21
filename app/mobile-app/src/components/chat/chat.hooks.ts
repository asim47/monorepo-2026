// Chat hooks for messaging functionality
import { 
  mockGetConversations,
  mockGetMessages,
  mockSendMessage,
  MockConversation,
  MockMessage 
} from '@/services/mock/chat.mock';
import { useMutation, useQuery } from '@tanstack/react-query';

export type Conversation = MockConversation;
export type Message = MockMessage;

/**
 * Hook to get all conversations
 * Uses mock service with sample conversations
 * 
 * To use real API:
 * 1. Set USE_MOCK_API = false in constants/api_keys
 * 2. Replace mockGetConversations with apiRequest call to /conversations
 */
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: mockGetConversations,
  });
};

/**
 * Hook to get messages for a conversation
 * Uses mock service with sample messages
 * 
 * To use real API:
 * 1. Set USE_MOCK_API = false in constants/api_keys
 * 2. Replace mockGetMessages with apiRequest call to /conversations/:id/messages
 */
export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => mockGetMessages(conversationId),
    enabled: !!conversationId,
  });
};

/**
 * Hook to send a message
 * Uses mock service - adds message to local mock data
 * 
 * To use real API:
 * 1. Set USE_MOCK_API = false in constants/api_keys
 * 2. Replace mockSendMessage with apiRequest call to /conversations/:id/messages
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({
      conversationId,
      text,
    }: {
      conversationId: string;
      text: string;
    }) => mockSendMessage(conversationId, text),
  });
};
