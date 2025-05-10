import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatisticsCard from '@/features/admin/dashboard/components/StatisticsCard';
import { RiUserLine } from 'react-icons/ri';

describe('StatisticsCard Component', () => {
  it('renders without crashing', () => {
    render(
      <StatisticsCard
        title="Total Users"
        value="1,234"
        icon={<RiUserLine data-testid="user-icon" />}
      />
    );
    
    // Check if the component renders
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });
  
  it('displays title and value correctly', () => {
    render(
      <StatisticsCard
        title="Total Revenue"
        value="$10,000"
        icon={<RiUserLine data-testid="user-icon" />}
      />
    );
    
    // Check if title and value are rendered correctly
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();
  });
  
  it('renders the icon', () => {
    render(
      <StatisticsCard
        title="Total Users"
        value="1,234"
        icon={<RiUserLine data-testid="user-icon" />}
      />
    );
    
    // Check if the icon is rendered
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });
  
  it('displays trend information when provided', () => {
    render(
      <StatisticsCard
        title="Total Users"
        value="1,234"
        icon={<RiUserLine data-testid="user-icon" />}
        trend={{ value: '5%', isUp: true }}
      />
    );
    
    // Check if trend information is rendered
    expect(screen.getByText('↑ 5%')).toBeInTheDocument();
    expect(screen.getByText('前月比')).toBeInTheDocument();
  });
  
  it('displays downward trend correctly', () => {
    render(
      <StatisticsCard
        title="Total Users"
        value="1,234"
        icon={<RiUserLine data-testid="user-icon" />}
        trend={{ value: '3%', isUp: false }}
      />
    );
    
    // Check if downward trend is rendered correctly
    expect(screen.getByText('↓ 3%')).toBeInTheDocument();
  });
  
  it('applies custom background color when provided', () => {
    const { container } = render(
      <StatisticsCard
        title="Total Users"
        value="1,234"
        icon={<RiUserLine data-testid="user-icon" />}
        bgColor="bg-red-100"
      />
    );
    
    // Check if custom background color is applied
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-red-100');
  });
});