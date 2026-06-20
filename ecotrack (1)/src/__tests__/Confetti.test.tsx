import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Confetti from '../components/Confetti';

describe('Confetti Component', () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      restore: vi.fn(),
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
    } as any);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      // Don't actually loop synchronously forever, just return an ID
      return 123;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  it('renders without crashing', () => {
    const { container } = render(<Confetti active={true} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
  
  it('does not render canvas when not active', () => {
    const { container } = render(<Confetti active={false} />);
    expect(container.querySelector('canvas')).not.toBeInTheDocument();
  });

  it('cancels animation frame on unmount or inactive', () => {
    const { rerender, unmount } = render(<Confetti active={true} />);
    // Because requestAnimationFrame is mocked to return 123
    rerender(<Confetti active={false} />);
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(123);
    unmount();
  });
});
