import AccountSettings from '@/features/user/account/components/AccountSettings';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the react-icons
vi.mock('react-icons/ri', () => ({
  RiLockLine: () => <div data-testid="icon-lock" />,
  RiNotification3Line: () => <div data-testid="icon-notification" />,
  RiGlobalLine: () => <div data-testid="icon-global" />,
  RiShieldLine: () => <div data-testid="icon-shield" />,
}));

describe('AccountSettings Component', () => {
  const mockUser = {
    id: 1,
    name: '山田 太郎',
    email: 'yamada.taro@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    phone: '090-1234-5678',
    address: {
      postal: '123-4567',
      prefecture: '東京都',
      city: '渋谷区',
      line1: '渋谷1-2-3',
      line2: 'アパート101',
    },
    memberSince: '2022年10月',
  };

  it('should render the component with heading', () => {
    render(<AccountSettings user={mockUser} />);

    // Check if the component renders without crashing
    expect(screen.getByText('アカウント設定')).toBeInTheDocument();
  });

  it('should render the password change section', () => {
    render(<AccountSettings user={mockUser} />);

    // Check if the password change section is rendered
    expect(screen.getByText('パスワード変更')).toBeInTheDocument();
    expect(screen.getByLabelText('現在のパスワード')).toBeInTheDocument();
    expect(screen.getByLabelText('新しいパスワード')).toBeInTheDocument();
    expect(
      screen.getByLabelText('新しいパスワード（確認）')
    ).toBeInTheDocument();
    expect(screen.getByText('パスワードを変更')).toBeInTheDocument();

    // Check if the icon is rendered
    expect(screen.getByTestId('icon-lock')).toBeInTheDocument();
  });

  it('should render the notification settings section', () => {
    render(<AccountSettings user={mockUser} />);

    // Check if the notification settings section is rendered
    expect(screen.getByText('通知設定')).toBeInTheDocument();
    expect(screen.getByText('メール通知')).toBeInTheDocument();
    expect(screen.getByText('SMS通知')).toBeInTheDocument();
    expect(screen.getByText('アプリ内通知')).toBeInTheDocument();

    // Check if the user email is displayed in the notification settings
    expect(screen.getByText(/yamada.taro@example.com/)).toBeInTheDocument();

    // Check if the icon is rendered
    expect(screen.getByTestId('icon-notification')).toBeInTheDocument();
  });

  it('should render the language and currency settings section', () => {
    render(<AccountSettings user={mockUser} />);

    // Check if the language and currency settings section is rendered
    expect(screen.getByText('言語と通貨')).toBeInTheDocument();
    expect(screen.getByLabelText('言語')).toBeInTheDocument();
    expect(screen.getByLabelText('通貨')).toBeInTheDocument();

    // Check if the icon is rendered
    expect(screen.getByTestId('icon-global')).toBeInTheDocument();
  });

  it('should render the security settings section', () => {
    render(<AccountSettings user={mockUser} />);

    // Check if the security settings section is rendered
    expect(screen.getByText('セキュリティ')).toBeInTheDocument();
    expect(screen.getByText('二段階認証')).toBeInTheDocument();

    // Check if the icon is rendered
    expect(screen.getByTestId('icon-shield')).toBeInTheDocument();
  });

  it('should toggle email notifications when clicked', () => {
    render(<AccountSettings user={mockUser} />);

    // Find the email notifications toggle by finding the parent element first
    const emailNotificationSection = screen
      .getByText('メール通知')
      .closest('div')?.parentElement;
    const emailToggle = emailNotificationSection?.querySelector(
      'input[type="checkbox"]'
    );

    // Check if the toggle exists
    expect(emailToggle).toBeInTheDocument();

    if (emailToggle) {
      // Initially, email notifications should be enabled (checked)
      expect(emailToggle).toBeChecked();

      // Click the toggle to disable email notifications
      fireEvent.click(emailToggle);

      // Now, email notifications should be disabled (unchecked)
      expect(emailToggle).not.toBeChecked();

      // Click the toggle again to enable email notifications
      fireEvent.click(emailToggle);

      // Now, email notifications should be enabled again (checked)
      expect(emailToggle).toBeChecked();
    }
  });

  it('should change language when selected', () => {
    render(<AccountSettings user={mockUser} />);

    // Find the language select
    const languageSelect = screen.getByLabelText('言語');

    // Initially, language should be set to Japanese
    expect(languageSelect).toHaveValue('ja');

    // Change the language to English
    fireEvent.change(languageSelect, { target: { value: 'en' } });

    // Now, language should be set to English
    expect(languageSelect).toHaveValue('en');
  });

  it('should change currency when selected', () => {
    render(<AccountSettings user={mockUser} />);

    // Find the currency select
    const currencySelect = screen.getByLabelText('通貨');

    // Initially, currency should be set to JPY
    expect(currencySelect).toHaveValue('JPY');

    // Change the currency to USD
    fireEvent.change(currencySelect, { target: { value: 'USD' } });

    // Now, currency should be set to USD
    expect(currencySelect).toHaveValue('USD');
  });

  it('should toggle two-factor authentication when clicked', () => {
    render(<AccountSettings user={mockUser} />);

    // Find the two-factor authentication toggle by finding the parent element first
    const twoFactorSection = screen
      .getByText('二段階認証')
      .closest('div')?.parentElement;
    const twoFactorToggle = twoFactorSection?.querySelector(
      'input[type="checkbox"]'
    );

    // Check if the toggle exists
    expect(twoFactorToggle).toBeInTheDocument();

    if (twoFactorToggle) {
      // Initially, two-factor authentication should be disabled (unchecked)
      expect(twoFactorToggle).not.toBeChecked();

      // Click the toggle to enable two-factor authentication
      fireEvent.click(twoFactorToggle);

      // Now, two-factor authentication should be enabled (checked)
      expect(twoFactorToggle).toBeChecked();

      // Click the toggle again to disable two-factor authentication
      fireEvent.click(twoFactorToggle);

      // Now, two-factor authentication should be disabled again (unchecked)
      expect(twoFactorToggle).not.toBeChecked();
    }
  });
});
