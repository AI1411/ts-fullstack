import AccountProfile from '@/features/user/account/components/AccountProfile';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AccountProfile Component', () => {
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
    render(<AccountProfile user={mockUser} />);

    // Check if the component renders without crashing
    expect(screen.getByText('プロフィール情報')).toBeInTheDocument();
  });

  it('should render the user avatar and name', () => {
    render(<AccountProfile user={mockUser} />);

    // Check if the avatar is rendered
    const avatar = screen.getByAltText('山田 太郎');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockUser.avatar);

    // Check if the name is rendered
    expect(screen.getAllByText('山田 太郎')[0]).toBeInTheDocument();
  });

  it('should render the member since information', () => {
    render(<AccountProfile user={mockUser} />);

    // Check if the member since information is rendered
    expect(screen.getByText('会員登録日: 2022年10月')).toBeInTheDocument();
  });

  it('should render the basic information section', () => {
    render(<AccountProfile user={mockUser} />);

    // Check if the basic information section is rendered
    expect(screen.getByText('基本情報')).toBeInTheDocument();

    // Check if the user details are rendered
    expect(screen.getByText('氏名')).toBeInTheDocument();
    expect(screen.getAllByText('山田 太郎')[1]).toBeInTheDocument();

    expect(screen.getByText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByText('yamada.taro@example.com')).toBeInTheDocument();

    expect(screen.getByText('電話番号')).toBeInTheDocument();
    expect(screen.getByText('090-1234-5678')).toBeInTheDocument();
  });

  it('should render the address information section', () => {
    render(<AccountProfile user={mockUser} />);

    // Check if the address information section is rendered
    expect(screen.getByText('住所情報')).toBeInTheDocument();

    // Check if the address details are rendered
    expect(screen.getByText('郵便番号')).toBeInTheDocument();
    expect(screen.getByText('123-4567')).toBeInTheDocument();

    expect(screen.getByText('住所')).toBeInTheDocument();
    expect(screen.getByText('東京都渋谷区渋谷1-2-3')).toBeInTheDocument();
    expect(screen.getByText('アパート101')).toBeInTheDocument();
  });

  it('should render the edit buttons', () => {
    render(<AccountProfile user={mockUser} />);

    // Check if the edit buttons are rendered
    expect(screen.getByText('プロフィール画像を変更')).toBeInTheDocument();
    expect(screen.getByText('基本情報を編集')).toBeInTheDocument();
    expect(screen.getByText('住所情報を編集')).toBeInTheDocument();
  });

  it('should have the correct styling for sections', () => {
    render(<AccountProfile user={mockUser} />);

    // Check if the basic information section has the correct classes
    const basicInfoSection = screen.getByText('基本情報').nextElementSibling;
    expect(basicInfoSection).toHaveClass('bg-gray-50');
    expect(basicInfoSection).toHaveClass('rounded-lg');

    // Check if the address information section has the correct classes
    const addressInfoSection = screen.getByText('住所情報').nextElementSibling;
    expect(addressInfoSection).toHaveClass('bg-gray-50');
    expect(addressInfoSection).toHaveClass('rounded-lg');
  });
});
