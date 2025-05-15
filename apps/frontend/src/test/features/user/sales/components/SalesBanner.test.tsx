import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SalesBanner from '@/features/user/sales/components/SalesBanner';

describe('SalesBanner Component', () => {
  it('should render the component', () => {
    render(<SalesBanner />);
    
    // Check if the component is defined
    expect(SalesBanner).toBeDefined();
    expect(typeof SalesBanner).toBe('function');
    
    // Check if main heading is rendered
    expect(screen.getByText('期間限定セール開催中！')).toBeInTheDocument();
    
    // Check if description is rendered
    expect(screen.getByText('最大50%オフの特別価格でお買い得。お見逃しなく！')).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByText('セール商品を見る')).toBeInTheDocument();
    expect(screen.getByText('すべての商品')).toBeInTheDocument();
  });
  
  it('should render the countdown timer', () => {
    render(<SalesBanner />);
    
    // Check if countdown section is rendered
    expect(screen.getByText('セール終了まで')).toBeInTheDocument();
    
    // Check if countdown timer elements are rendered
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('時間')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('分')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('秒')).toBeInTheDocument();
  });
  
  it('should have correct links', () => {
    render(<SalesBanner />);
    
    // Check if links have correct href attributes
    const saleProductsLink = screen.getByText('セール商品を見る');
    expect(saleProductsLink.closest('a')).toHaveAttribute('href', '#sales-products');
    
    const allProductsLink = screen.getByText('すべての商品');
    expect(allProductsLink.closest('a')).toHaveAttribute('href', '/products');
  });
});