import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageList from '@/features/admin/chats/components/MessageList';
import { ChatMessageWithSender } from '@/features/admin/chats/controllers';

// Mock date-fns to avoid locale issues in tests
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(() => '3日前')
}));

describe('MessageList Component', () => {
  const currentUserId = 1;

  it('should render empty state when no messages are provided', () => {
    render(<MessageList messages={[]} currentUserId={currentUserId} />);
    
    expect(screen.getByText('メッセージがありません。最初のメッセージを送信しましょう。')).toBeInTheDocument();
  });

  it('should render messages from current user correctly', () => {
    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: currentUserId,
          content: 'Hello from current user',
          is_read: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        sender: {
          id: currentUserId,
          name: 'Current User'
        }
      }
    ];

    render(<MessageList messages={mockMessages} currentUserId={currentUserId} />);
    
    // Message content should be displayed
    expect(screen.getByText('Hello from current user')).toBeInTheDocument();
    
    // Read status should be displayed for current user's messages
    expect(screen.getByText('既読')).toBeInTheDocument();
    
    // Timestamp should be displayed
    expect(screen.getByText('3日前')).toBeInTheDocument();
    
    // Sender name should not be displayed for current user's messages
    expect(screen.queryByText('Current User')).not.toBeInTheDocument();
  });

  it('should render messages from other users correctly', () => {
    const otherUserId = 2;
    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: otherUserId,
          content: 'Hello from other user',
          is_read: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        sender: {
          id: otherUserId,
          name: 'Other User'
        }
      }
    ];

    render(<MessageList messages={mockMessages} currentUserId={currentUserId} />);
    
    // Message content should be displayed
    expect(screen.getByText('Hello from other user')).toBeInTheDocument();
    
    // Sender name should be displayed for other users' messages
    expect(screen.getByText('Other User')).toBeInTheDocument();
    
    // Timestamp should be displayed
    expect(screen.getByText('3日前')).toBeInTheDocument();
    
    // Read status should not be displayed for other users' messages
    expect(screen.queryByText('既読')).not.toBeInTheDocument();
    expect(screen.queryByText('未読')).not.toBeInTheDocument();
  });

  it('should render unread messages from current user correctly', () => {
    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: currentUserId,
          content: 'Hello from current user',
          is_read: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        sender: {
          id: currentUserId,
          name: 'Current User'
        }
      }
    ];

    render(<MessageList messages={mockMessages} currentUserId={currentUserId} />);
    
    // Message content should be displayed
    expect(screen.getByText('Hello from current user')).toBeInTheDocument();
    
    // Unread status should be displayed for current user's messages
    expect(screen.getByText('未読')).toBeInTheDocument();
  });

  it('should render multiple messages in correct order', () => {
    const otherUserId = 2;
    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: currentUserId,
          content: 'First message',
          is_read: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        sender: {
          id: currentUserId,
          name: 'Current User'
        }
      },
      {
        message: {
          id: 2,
          chat_id: 1,
          sender_id: otherUserId,
          content: 'Second message',
          is_read: false,
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        },
        sender: {
          id: otherUserId,
          name: 'Other User'
        }
      },
      {
        message: {
          id: 3,
          chat_id: 1,
          sender_id: currentUserId,
          content: 'Third message',
          is_read: false,
          created_at: '2023-01-03T00:00:00Z',
          updated_at: '2023-01-03T00:00:00Z'
        },
        sender: {
          id: currentUserId,
          name: 'Current User'
        }
      }
    ];

    render(<MessageList messages={mockMessages} currentUserId={currentUserId} />);
    
    // All messages should be displayed in the correct order
    const messages = screen.getAllByText(/message$/);
    expect(messages).toHaveLength(3);
    expect(messages[0]).toHaveTextContent('First message');
    expect(messages[1]).toHaveTextContent('Second message');
    expect(messages[2]).toHaveTextContent('Third message');
  });

  it('should handle messages with long content', () => {
    const longMessage = 'This is a very long message that should still be displayed correctly in the message list component without any issues with overflow or layout problems.';
    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: currentUserId,
          content: longMessage,
          is_read: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        sender: {
          id: currentUserId,
          name: 'Current User'
        }
      }
    ];

    render(<MessageList messages={mockMessages} currentUserId={currentUserId} />);
    
    // Long message should be displayed
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should display first letter of sender name in avatar', () => {
    const otherUserId = 2;
    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: otherUserId,
          content: 'Hello',
          is_read: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        sender: {
          id: otherUserId,
          name: 'Other User'
        }
      }
    ];

    render(<MessageList messages={mockMessages} currentUserId={currentUserId} />);
    
    // Avatar should display the first letter of the sender's name
    expect(screen.getByText('O')).toBeInTheDocument();
  });
});