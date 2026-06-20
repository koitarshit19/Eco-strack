import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BottomNavBar from '../components/BottomNavBar';

describe('BottomNavBar Component', () => {
  it('calls setActiveTab with correct argument when an inactive tab is clicked', () => {
    const setActiveTab = vi.fn();
    render(<BottomNavBar activeTab="Home" setActiveTab={setActiveTab} />);
    const logTab = screen.getByRole('button', { name: "Go to Log" });
    fireEvent.click(logTab);
    expect(setActiveTab).toHaveBeenCalledWith('Log');
  });

  it('calls setActiveTab with correct argument when the active tab is clicked', () => {
    const setActiveTab = vi.fn();
    render(<BottomNavBar activeTab="Home" setActiveTab={setActiveTab} />);
    const homeTab = screen.getByRole('button', { name: "Current Tab: Home" });
    fireEvent.click(homeTab);
    expect(setActiveTab).toHaveBeenCalledWith('Home');
  });
});
