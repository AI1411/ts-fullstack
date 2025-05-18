import Chart from '@/features/admin/dashboard/components/Chart';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Chart Component', () => {
  it('renders without crashing', () => {
    render(
      <Chart title="Test Chart">
        <div>Chart Content</div>
      </Chart>
    );

    // Check if the chart renders
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('displays the title correctly', () => {
    render(
      <Chart title="Sales Overview">
        <div>Chart Content</div>
      </Chart>
    );

    // Check if the title is rendered correctly
    expect(screen.getByText('Sales Overview')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Chart title="Test Chart">
        <div>Chart Content</div>
      </Chart>
    );

    // Check if the children content is rendered
    expect(screen.getByText('Chart Content')).toBeInTheDocument();
  });
});
