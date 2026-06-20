import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useStore } from '../store/useStore';
import DashboardTab from '../components/DashboardTab';

vi.mock('../components/Confetti', () => ({
  default: ({ active, onComplete }: any) => {
    if (active) {
      setTimeout(onComplete, 10);
    }
    return null;
  }
}));

describe('DashboardTab Component', () => {
  const defaultProps = {
    currentFootprint: 140,
    footprintGoal: 180,
    onUpdateFootprintGoal: vi.fn(),
    loggedActivities: [],
    dailyMissionCompleted: false,
    onCompleteDailyMission: vi.fn(),
    onNavigateToLog: vi.fn(),
    onNavigateToTab: vi.fn(),
  };

  it('renders correctly', () => {
    render(<DashboardTab {...defaultProps} />);
    expect(screen.getByText(/Hello, Nature Guardian/i)).toBeInTheDocument();
    expect(screen.getByText(/140\.0/)).toBeInTheDocument();
  });

  it('updates footprint goal', () => {
    const handleUpdate = vi.fn();
    render(<DashboardTab {...defaultProps} onUpdateFootprintGoal={handleUpdate} />);
    
    const decreaseBtn = screen.getByRole('button', { name: "Decrease carbon budget limit by 10 kilograms" });
    const increaseBtn = screen.getByRole('button', { name: "Increase carbon budget limit by 10 kilograms" });
    
    fireEvent.click(decreaseBtn);
    expect(handleUpdate).toHaveBeenCalledWith(170); // 180 -10
    
    fireEvent.click(increaseBtn);
    expect(handleUpdate).toHaveBeenCalledWith(190); // 180 +10
  });

  it('shows celebrate button when goal is reached', () => {
    render(<DashboardTab {...defaultProps} currentFootprint={100} footprintGoal={150} />);
    const celebrateBtn = screen.getByTitle('Celebrate Goal Reach with Confetti!');
    expect(celebrateBtn).toBeInTheDocument();
    
    fireEvent.click(celebrateBtn);
    // Should render confetti and restart it
  });

  it('triggers confetti when footprint crosses below goal, and completes', () => {
    vi.useFakeTimers();
    const { rerender } = render(<DashboardTab {...defaultProps} currentFootprint={200} footprintGoal={180} />);
    // cross the threshold
    rerender(<DashboardTab {...defaultProps} currentFootprint={100} footprintGoal={180} />);
    act(() => {
      vi.advanceTimersByTime(3500);
    });
    vi.useRealTimers();
  });

  it('completes daily mission', () => {
    const handleComplete = vi.fn();
    render(<DashboardTab {...defaultProps} onCompleteDailyMission={handleComplete} />);
    
    const completeButton = screen.getByText('Complete Task');
    fireEvent.click(completeButton);
    
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
  
  it('navigates to log when button is clicked', () => {
      const handleNavigate = vi.fn();
      render(<DashboardTab {...defaultProps} onNavigateToLog={handleNavigate} />);
      const logButton = screen.getByRole('button', { name: "Create new log entry" });
      fireEvent.click(logButton);
      expect(handleNavigate).toHaveBeenCalledTimes(1);
  });

  it('navigates to full log list if activities exist', () => {
      const handleNavigate = vi.fn();
      const activities = [
        { id: '1', category: 'Energy' as ActivityCategory, name: 'Turn off lights', value: 2, saved: 0.2, unit: 'hrs', timestamp: new Date(), dateStr: 'Today' },
        { id: '2', category: 'Unknown' as unknown as ActivityCategory, name: 'Unknown action', value: 1, saved: 0, unit: 'unit', timestamp: new Date(), dateStr: 'Today' }
      ];
      render(<DashboardTab {...defaultProps} loggedActivities={activities} onNavigateToLog={handleNavigate} />);
      const logButton = screen.getByRole('button', { name: "View Full Log list" });
      fireEvent.click(logButton);
      expect(handleNavigate).toHaveBeenCalledTimes(1);
  });

  it('navigates to impact via discussion group', () => {
      const handleNavigateTab = vi.fn();
      render(<DashboardTab {...defaultProps} onNavigateToTab={handleNavigateTab} />);
      const discussButton = screen.getByRole('button', { name: "Navigate to Impact and discuss with Curation group" });
      fireEvent.click(discussButton);
      expect(handleNavigateTab).toHaveBeenCalledWith('Impact');
  });
});
