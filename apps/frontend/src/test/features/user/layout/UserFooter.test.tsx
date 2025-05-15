import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserFooter from '@/features/user/layout/UserFooter';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}));

describe('UserFooter Component', () => {
  it('should render the component', () => {
    render(<UserFooter />);

    // Check if the component is defined
    expect(UserFooter).toBeDefined();
    expect(typeof UserFooter).toBe('function');

    // Check if the footer is rendered
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should render company information', () => {
    render(<UserFooter />);

    // Check if company name is rendered
    expect(screen.getByText('ECサイト')).toBeInTheDocument();

    // Check if company description is rendered
    expect(screen.getByText(/高品質な商品を取り揃えたオンラインストア/)).toBeInTheDocument();
  });

  it('should render quick links with correct hrefs', () => {
    render(<UserFooter />);

    // Check if quick links section is rendered
    expect(screen.getByText('クイックリンク')).toBeInTheDocument();

    // Check if links are rendered with correct hrefs
    const links = screen.getAllByTestId('link');
    const homeLink = links.find(link => link.textContent === 'ホーム');
    expect(homeLink).toHaveAttribute('href', '/');

    const productsLink = links.find(link => link.textContent === '商品一覧');
    expect(productsLink).toHaveAttribute('href', '/products');

    const categoriesLink = links.find(link => link.textContent === 'カテゴリー');
    expect(categoriesLink).toHaveAttribute('href', '/categories');
  });

  it('should render customer service links with correct hrefs', () => {
    render(<UserFooter />);

    // Check if customer service section is rendered
    expect(screen.getByText('カスタマーサービス')).toBeInTheDocument();

    // Check if links are rendered with correct hrefs
    const links = screen.getAllByTestId('link');
    const accountLink = links.find(link => link.textContent === 'アカウント');
    expect(accountLink).toHaveAttribute('href', '/account');

    const ordersLink = links.find(link => link.textContent === '注文履歴');
    expect(ordersLink).toHaveAttribute('href', '/orders');

    const faqLink = links.find(link => link.textContent === 'よくある質問');
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  it('should render contact information', () => {
    render(<UserFooter />);

    // Check if contact section is rendered
    // Use a more specific selector to target the heading
    const contactHeadings = screen.getAllByText('お問い合わせ');
    const contactHeading = contactHeadings.find(
      element => element.tagName.toLowerCase() === 'h3'
    );
    expect(contactHeading).toBeInTheDocument();

    // Check if address is rendered
    expect(screen.getByText(/〒100-0001 東京都千代田区/)).toBeInTheDocument();

    // Check if phone number is rendered
    expect(screen.getByText('03-1234-5678')).toBeInTheDocument();

    // Check if email is rendered
    expect(screen.getByText('info@example.com')).toBeInTheDocument();
  });

  it('should render copyright with current year', () => {
    render(<UserFooter />);

    // Check if copyright is rendered with current year
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${currentYear} ECサイト`))).toBeInTheDocument();
  });

  it('should render footer links with correct hrefs', () => {
    render(<UserFooter />);

    // Check if footer links are rendered with correct hrefs
    const links = screen.getAllByTestId('link');
    const privacyLink = links.find(link => link.textContent === 'プライバシーポリシー');
    expect(privacyLink).toHaveAttribute('href', '/privacy');

    const termsLink = links.find(link => link.textContent === '利用規約');
    expect(termsLink).toHaveAttribute('href', '/terms');

    const sitemapLink = links.find(link => link.textContent === 'サイトマップ');
    expect(sitemapLink).toHaveAttribute('href', '/sitemap');
  });
});
