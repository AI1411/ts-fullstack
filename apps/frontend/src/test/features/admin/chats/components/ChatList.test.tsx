import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatList from '@/features/admin/chats/components/ChatList';
import { chatService } from '@/features/admin/chats/services';

// Mock the chatService
vi.mock('@/features/admin/chats/services', () => ({
  chatService: {
    getUserChats: vi.fn()
  }
}));

// Mock the React Query hook
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
      return (
        <a href={href} className={className} data-testid="chat-link">
          {children}
        </a>
      );
    }
  };
});

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(() => '3時間前')
}));

vi.mock('date-fns/locale', () => ({
  ja: {}
}));

import { useQuery } from '@tanstack/react-query';

describe('ChatList Component', () => {
  const mockChats = [
    {
      chat: {
        id: 1,
        user1_id: 1,
        user2_id: 2,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      },
      otherUser: {
        id: 2,
        name: 'Test User 1',
        email: 'test1@example.com'
      }
    },
    {
      chat: {
        id: 2,
        user1_id: 1,
        user2_id: 3,
        created_at: '2023-01-02T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z'
      },
      otherUser: {
        id: 3,
        name: 'Test User 2',
        email: 'test2@example.com'
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    } as any);

    render(<ChatList />);
    
    // Check if loading spinner is rendered
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Test error')
    } as any);

    render(<ChatList />);
    
    // Check if error message is rendered
    expect(screen.getByText('エラーが発生しました。再度お試しください。')).toBeInTheDocument();
  });

  it('renders chat list correctly', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockChats,
      isLoading: false,
      error: null
    } as any);

    render(<ChatList />);
    
    // Check if search input is rendered
    expect(screen.getByPlaceholderText('ユーザー名で検索...')).toBeInTheDocument();
    
    // Check if chat items are rendered
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
    
    // Check if time is rendered
    expect(screen.getAllByText('3時間前')).toHaveLength(2);
    
    // Check if links are rendered with correct hrefs
    const links = screen.getAllByTestId('chat-link');
    expect(links[0]).toHaveAttribute('href', '/admin/chats/1');
    expect(links[1]).toHaveAttribute('href', '/admin/chats/2');
  });

  it('filters chats based on search term', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockChats,
      isLoading: false,
      error: null
    } as any);

    render(<ChatList />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText('ユーザー名で検索...');
    
    // Type in the search input
    fireEvent.change(searchInput, { target: { value: 'User 1' } });
    
    // Check if only the matching chat is rendered
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.queryByText('Test User 2')).not.toBeInTheDocument();
  });

  it('shows empty message when no chats match search', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockChats,
      isLoading: false,
      error: null
    } as any);

    render(<ChatList />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText('ユーザー名で検索...');
    
    // Type in the search input with a term that won't match any chats
    fireEvent.change(searchInput, { target: { value: 'No Match' } });
    
    // Check if empty message is rendered
    expect(screen.getByText('検索結果がありません')).toBeInTheDocument();
  });

  it('shows empty message when there are no chats', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    } as any);

    render(<ChatList />);
    
    // Check if empty message is rendered
    expect(screen.getByText('チャットがありません')).toBeInTheDocument();
  });
});