import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessageForm from '@/features/admin/chats/components/MessageForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { chatService } from '@/features/admin/chats/services';

// Mock the chat service
vi.mock('@/features/admin/chats/services', () => ({
  chatService: {
    createChatMessage: vi.fn()
  }
}));

describe('MessageForm Component', () => {
  let queryClient: QueryClient;
  const mockChatId = 1;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText('メッセージを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled(); // Button should be disabled initially
  });

  it('should enable the button when text is entered', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText('メッセージを入力...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('should disable the button when text is empty or only whitespace', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText('メッセージを入力...');
    
    // Enter some text
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(screen.getByRole('button')).not.toBeDisabled();
    
    // Clear the text
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByRole('button')).toBeDisabled();
    
    // Enter only whitespace
    fireEvent.change(input, { target: { value: '   ' } });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not submit the form when message is empty', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(chatService.createChatMessage).not.toHaveBeenCalled();
  });

  it('should submit the message and clear the input on success', async () => {
    // Mock successful message creation
    vi.mocked(chatService.createChatMessage).mockResolvedValue({
      id: 1,
      chat_id: mockChatId,
      sender_id: 1,
      content: 'Hello',
      is_read: false,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    // Enter a message
    const input = screen.getByPlaceholderText('メッセージを入力...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    // Submit the form
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Check for loading state
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(input).toBeDisabled();
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(chatService.createChatMessage).toHaveBeenCalledWith(mockChatId, {
        sender_id: 1,
        content: 'Hello'
      });
    });
    
    // Input should be cleared
    expect(input).toHaveValue('');
    expect(input).not.toBeDisabled();
  });

  it('should handle error when message creation fails', async () => {
    // Mock failed message creation
    const mockError = new Error('Failed to send message');
    vi.mocked(chatService.createChatMessage).mockRejectedValue(mockError);
    
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    // Enter a message
    const input = screen.getByPlaceholderText('メッセージを入力...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    // Submit the form
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to send message:',
        mockError
      );
    });
    
    // Input should not be cleared and should be enabled
    expect(input).toHaveValue('Hello');
    expect(input).not.toBeDisabled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should trim whitespace from the message', async () => {
    // Mock successful message creation
    vi.mocked(chatService.createChatMessage).mockResolvedValue({
      id: 1,
      chat_id: mockChatId,
      sender_id: 1,
      content: 'Hello',
      is_read: false,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    // Enter a message with whitespace
    const input = screen.getByPlaceholderText('メッセージを入力...');
    fireEvent.change(input, { target: { value: '  Hello  ' } });
    
    // Submit the form
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(chatService.createChatMessage).toHaveBeenCalledWith(mockChatId, {
        sender_id: 1,
        content: 'Hello' // Whitespace should be trimmed
      });
    });
  });

  it('should handle clicking the send button', async () => {
    // Mock successful message creation
    vi.mocked(chatService.createChatMessage).mockResolvedValue({
      id: 1,
      chat_id: mockChatId,
      sender_id: 1,
      content: 'Hello',
      is_read: false,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MessageForm chatId={mockChatId} />
      </QueryClientProvider>
    );

    // Enter a message
    const input = screen.getByPlaceholderText('メッセージを入力...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    // Click the send button
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(chatService.createChatMessage).toHaveBeenCalledWith(mockChatId, {
        sender_id: 1,
        content: 'Hello'
      });
    });
  });
});