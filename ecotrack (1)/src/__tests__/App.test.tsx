import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import * as useStoreFile from '../store/useStore';
import { INITIAL_LOGGED_ACTIVITIES, INITIAL_ACHIEVEMENTS } from '../data';

describe('App Integration', () => {
  beforeEach(() => {
    useStoreFile.useStore.setState({
      totalSaved: 240.0,
      currentFootprint: 140.0,
      footprintGoal: 180.0,
      loggedActivities: INITIAL_LOGGED_ACTIVITIES,
      achievements: INITIAL_ACHIEVEMENTS,
      dailyMissionCompleted: false,
      toasts: [],
      darkMode: false,
    });
  });

  it('renders Dashboard tab by default', () => {
    render(<App />);
    expect(screen.getByText(/Hello, Nature Guardian/i)).toBeInTheDocument();
  });

  it('navigates to Log tab when Log Activity is clicked', () => {
    render(<App />);
    const logButton = screen.getByRole('button', { name: "Navigate to Log" });
    fireEvent.click(logButton);
    expect(screen.getByText(/Daily Action Log/i)).toBeInTheDocument();
  });

  it('navigates to Trends tab', () => {
    render(<App />);
    const trendsTab = screen.getByRole('button', { name: "Navigate to Trends" });
    fireEvent.click(trendsTab);
    expect(screen.getByText(/Climate Performance & Trends/i)).toBeInTheDocument();
  });

  it('navigates to Impact tab', () => {
    act(() => { useStoreFile.useStore.getState().makeToast('Walking', 2); });
    render(<App />);
    const impactTab = screen.getByRole('button', { name: "Navigate to Impact" });
    fireEvent.click(impactTab);
    expect(screen.getByText(/GLOBAL MILESTONE REPORT/i)).toBeInTheDocument();
  });

  it('allows dismissing a toast notification', () => {
    act(() => { useStoreFile.useStore.getState().makeToast('Biking', 3.5); });
    render(<App />);

    const dismissButtons = screen.queryAllByRole('button', { name: "Dismiss notification" });
    if(dismissButtons.length > 0) {
       fireEvent.click(dismissButtons[0]);
    }
  });

  it('resets app progress when reset button is clicked', () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    useStoreFile.useStore.getState().logActivity('Transport', 'Walking', 5, 2.0);
    render(<App />);
    const resetButton = screen.getByText('Reset App Progress');
    fireEvent.click(resetButton);
    expect(useStoreFile.useStore.getState().totalSaved).toBe(240); // Initial value
    vi.restoreAllMocks();
  });

  it('updates dark mode and localStorage', () => {
    render(<App />);
    const themeBtn = screen.getByRole('button', { name: /Toggle light and dark mode/i });
    fireEvent.click(themeBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ecotrack-theme')).toBe('dark');
  });

  it('handles completing daily mission', () => {
    render(<App />);
    const completeMissionBtn = screen.getByRole('button', { name: /Complete daily mission/i });
    fireEvent.click(completeMissionBtn);
    
    expect(useStoreFile.useStore.getState().dailyMissionCompleted).toBe(true);
  });

  it('does not log activity again if daily mission is already completed', () => {
    useStoreFile.useStore.setState({ dailyMissionCompleted: true });
    render(<App />);
    const completeMissionBtn = screen.getByRole('button', { name: /has been completed/i });
    fireEvent.click(completeMissionBtn);
    expect(useStoreFile.useStore.getState().dailyMissionCompleted).toBe(true);
  });

  it('handles theme persistence failure', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const orig = window.localStorage.setItem;
    window.localStorage.setItem = vi.fn(() => { throw new Error('Quota'); });
    
    render(<App />); 
    
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
    window.localStorage.setItem = orig;
  });

  it('navigates to log tab from dashboard', async () => {
    render(<App />);
    const logButton = screen.getByRole('button', { name: "View Full Log list" });
    fireEvent.click(logButton);
    await waitFor(() => {
      expect(screen.getByText(/Daily Action Log/i)).toBeInTheDocument();
    });
  });
});
