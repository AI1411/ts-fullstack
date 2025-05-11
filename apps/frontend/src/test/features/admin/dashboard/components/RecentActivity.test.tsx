import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecentActivity from '@/features/admin/dashboard/components/RecentActivity';

describe('RecentActivity Component', () => {
  it('renders without crashing', () => {
    render(<RecentActivity />);

    // Check if the component renders
    expect(screen.getByText('最近のアクティビティ')).toBeInTheDocument();
  });

  it('displays all activities', () => {
    render(<RecentActivity />);

    // Check if some activity titles are rendered
    expect(screen.getAllByText(/Todoが完了しました/)).not.toHaveLength(0);
    expect(screen.getAllByText(/新しいユーザーが追加されました/)).not.toHaveLength(0);
    expect(screen.getAllByText(/Todoが更新されました/)).not.toHaveLength(0);

    // Check if activity descriptions are rendered
    expect(screen.getByText('プロジェクト計画書の作成')).toBeInTheDocument();
    expect(screen.getByText('tanaka@example.com')).toBeInTheDocument();
    expect(screen.getByText('ミーティング資料の準備')).toBeInTheDocument();
    expect(screen.getByText('クライアントへの提案書送付')).toBeInTheDocument();
    expect(screen.getByText('yamada@example.com')).toBeInTheDocument();

    // Check if timestamps are rendered
    expect(screen.getByText('5分前')).toBeInTheDocument();
    expect(screen.getByText('30分前')).toBeInTheDocument();
    expect(screen.getByText('1時間前')).toBeInTheDocument();
    expect(screen.getByText('3時間前')).toBeInTheDocument();
    expect(screen.getByText('昨日')).toBeInTheDocument();
  });

  it('displays the view all button', () => {
    render(<RecentActivity />);

    // Check if the view all button is rendered
    expect(screen.getByText('すべてのアクティビティを表示')).toBeInTheDocument();
  });
});
