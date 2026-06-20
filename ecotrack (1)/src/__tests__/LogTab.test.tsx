import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogTab from '../components/LogTab';

describe('LogTab Component', () => {
  it('renders log tab options', () => {
    render(<LogTab onLogActivity={() => {}} />);
    expect(screen.getByText(/Transport/i)).toBeInTheDocument();
    expect(screen.getByText(/Food/i)).toBeInTheDocument();
    expect(screen.getByText(/Energy/i)).toBeInTheDocument();
  });

  it('updates quantities and logs appropriate amounts', async () => {
    const handleLog = vi.fn();
    render(<LogTab onLogActivity={handleLog} />);
    
    const increaseBtn = screen.getByRole('button', { name: "Increase quantity of Plant-based Meal" });
    fireEvent.click(increaseBtn);
    
    // Original was undefined->1, +1 = 2
    // Then click "-" twice
    const decreaseBtn = screen.getByRole('button', { name: "Decrease quantity of Plant-based Meal" });
    fireEvent.click(decreaseBtn);
    fireEvent.click(decreaseBtn);
    // Should be back to 1
    
    // Attempt to decrease to 0, which should clamp to 1
    fireEvent.click(decreaseBtn);
    
    const logButton = screen.getByTitle('Log Plant-based Meal');
    fireEvent.click(logButton);
    
    const walkingLogBtn = screen.getByTitle('Log Walking');
    fireEvent.click(walkingLogBtn);

    const coldWashLogBtn = screen.getByTitle('Log Cold Wash Cycle');
    fireEvent.click(coldWashLogBtn);

    await waitFor(() => {
      expect(handleLog).toHaveBeenCalledWith('Food', 'Plant-based Meal', 1, 2.1);
      expect(handleLog).toHaveBeenCalledWith('Transport', 'Walking', 2, 0.8);
      expect(handleLog).toHaveBeenCalledWith('Energy', 'Cold Wash Cycle', 1, 0.5);
    });
  });

  it('hides image on error', () => {
    render(<LogTab onLogActivity={() => {}} />);
    const img = screen.getByAltText('Sustainability Inspiration');
    fireEvent.error(img);
    expect(img.style.display).toBe('none');
  });

  it('logs activity when clicking log button', async () => {
    const handleLog = vi.fn();
    render(<LogTab onLogActivity={handleLog} />);
    
    // There is no category filter to switch tabs inside LogTab, it just lays them out in a grid.
    const logButton = screen.getByTitle('Log Walking');
    fireEvent.click(logButton);

    await waitFor(() => {
      expect(handleLog).toHaveBeenCalledWith('Transport', 'Walking', 2, expect.any(Number));
    });
  });
});
