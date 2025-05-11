import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from '@/features/admin/users/components/UserForm';
import { userService } from '@/features/admin/users/services';

// Mock the userService
vi.mock('@/features/admin/users/services', () => ({
  userService: {
    createUser: vi.fn()
  }
}));

// Mock the React Query provider
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn()
  })
}));

describe('UserForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<UserForm />);

    // Check if the form title is rendered
    expect(screen.getByRole('heading', { name: 'ユーザーを追加' })).toBeInTheDocument();

    // Check if form inputs are rendered
    expect(screen.getByLabelText('名前')).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();

    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: 'ユーザーを追加' })).toBeInTheDocument();
  });

  it('updates form values when inputs change', () => {
    render(<UserForm />);

    const nameInput = screen.getByLabelText('名前');
    const emailInput = screen.getByLabelText('メールアドレス');
    const passwordInput = screen.getByLabelText('パスワード');

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Check if inputs have the new values
    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles password visibility when show/hide button is clicked', () => {
    render(<UserForm />);

    const passwordInput = screen.getByLabelText('パスワード');
    const toggleButton = screen.getByRole('button', { name: '表示' });

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the toggle button
    fireEvent.click(toggleButton);

    // Password should now be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: '隠す' })).toBeInTheDocument();

    // Click the toggle button again
    fireEvent.click(screen.getByRole('button', { name: '隠す' }));

    // Password should be hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submits the form with correct data', async () => {
    // Setup the mock to resolve successfully
    vi.mocked(userService.createUser).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    });

    render(<UserForm />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('名前'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'ユーザーを追加' }));

    // Check if the service was called with correct data
    expect(userService.createUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Wait for the form to reset after submission
    await waitFor(() => {
      expect(screen.getByLabelText('名前')).toHaveValue('');
      expect(screen.getByLabelText('メールアドレス')).toHaveValue('');
      expect(screen.getByLabelText('パスワード')).toHaveValue('');
    });
  });

  it('displays an error message when form submission fails', async () => {
    // Setup the mock to reject with an error
    vi.mocked(userService.createUser).mockRejectedValue(new Error('ユーザー登録に失敗しました'));

    render(<UserForm />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('名前'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'ユーザーを追加' }));

    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('ユーザー登録に失敗しました')).toBeInTheDocument();
    });
  });
});
