import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToastNotification from '../components/ToastNotification';

describe('ToastNotification Component', () => {
  it('renders correctly with props', () => {
    render(<ToastNotification actionName="Biking" kgSaved={2.5} onDismiss={() => {}} />);
    expect(screen.getByText(/Biking/i)).toBeInTheDocument();
    expect(screen.getByText(/\+2.5kg/i)).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', async () => {
    const handleDismiss = vi.fn();
    render(<ToastNotification actionName="Biking" kgSaved={2.5} onDismiss={handleDismiss} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
