import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActiveView from '../components/ActiveView';

// Mock components
vi.mock('../components/DashboardTab', () => ({
  default: () => <div data-testid="dashboard-tab">Dashboard</div>
}));
vi.mock('../components/LogTab', () => ({
  default: () => <div data-testid="log-tab">Log</div>
}));
vi.mock('../components/TrendsTab', () => ({
  default: () => <div data-testid="trends-tab">Trends</div>
}));
vi.mock('../components/ImpactTab', () => ({
  default: () => <div data-testid="impact-tab">Impact</div>
}));

describe('ActiveView component', () => {
  const defaultProps = {
    setActiveTab: vi.fn(),
    handleCompleteDailyMission: vi.fn(),
  };

  it('renders DashboardTab when activeTab is Home', () => {
    render(<ActiveView {...defaultProps} activeTab="Home" />);
    expect(screen.getByTestId('dashboard-tab')).toBeInTheDocument();
  });

  it('renders LogTab when activeTab is Log', () => {
    render(<ActiveView {...defaultProps} activeTab="Log" />);
    expect(screen.getByTestId('log-tab')).toBeInTheDocument();
  });

  it('renders TrendsTab when activeTab is Trends', () => {
    render(<ActiveView {...defaultProps} activeTab="Trends" />);
    expect(screen.getByTestId('trends-tab')).toBeInTheDocument();
  });

  it('renders ImpactTab when activeTab is Impact', () => {
    render(<ActiveView {...defaultProps} activeTab="Impact" />);
    expect(screen.getByTestId('impact-tab')).toBeInTheDocument();
  });

  it('renders null when activeTab is invalid', () => {
    const { container } = render(<ActiveView {...defaultProps} activeTab={"Invalid" as any} />);
    expect(container).toBeEmptyDOMElement();
  });
});
