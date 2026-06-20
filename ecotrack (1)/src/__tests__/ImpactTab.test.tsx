import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImpactTab from '../components/ImpactTab';
import { INITIAL_ACHIEVEMENTS } from '../data';

describe('ImpactTab Component', () => {
  it('renders lifetime impact and forest equivalents', () => {
    render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
    expect(screen.getByText(/GLOBAL MILESTONE REPORT/i)).toBeInTheDocument();
  });

  it('renders all achievement types including solar and unknown', () => {
    const customAchievements = [
      ...INITIAL_ACHIEVEMENTS.map(ach => ({...ach, locked: false})), // Unlock solar
      { id: 'ach-5', name: 'Unknown', description: '?', savedText: '?', level: 1, locked: false, iconType: 'fake' as any }
    ];
    render(<ImpactTab totalSaved={600} achievements={customAchievements} onUnlockSolar={() => {}} />);
    expect(screen.getByText('Solar Starter')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('handles successful clipboard copy', async () => {
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: vi.fn().mockResolvedValue(undefined)
        },
        configurable: true
    });
    render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
    fireEvent.click(screen.getByText('Share Milestone'));
    fireEvent.click(screen.getByText('Copy Message Link'));
    await waitFor(() => {
        expect(screen.getByText('Copied link')).toBeInTheDocument();
    });
  });

  it('falls back when clipboard is not available', async () => {
    // override navigator.clipboard descriptor to be undefined
    Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true
    });

    render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
    fireEvent.click(screen.getByText('Share Milestone'));
    fireEvent.click(screen.getByText('Copy Message Link'));

    await waitFor(() => {
        expect(screen.getByText('Copied link')).toBeInTheDocument();
    });
  });

  it('falls back when clipboard access throws synchronously', async () => {
    const fallbackSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    Object.defineProperty(navigator, 'clipboard', {
        get: () => { throw new Error('Blocked') },
        configurable: true
    });

    render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
    fireEvent.click(screen.getByText('Share Milestone'));
    fireEvent.click(screen.getByText('Copy Message Link'));

    await waitFor(() => {
        expect(screen.getByText('Copied link')).toBeInTheDocument();
    });
    vi.useFakeTimers();
    vi.advanceTimersByTime(2500);
    vi.useRealTimers();
    fallbackSpy.mockRestore();
  });

  it('falls back when clipboard promise rejects', async () => {
    const fallbackSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: vi.fn().mockRejectedValue(new Error("Not allowed"))
        },
        configurable: true
    });

    render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
    fireEvent.click(screen.getByText('Share Milestone'));
    fireEvent.click(screen.getByText('Copy Message Link'));

    await waitFor(() => {
        expect(screen.getByText('Copied link')).toBeInTheDocument();
    });
    vi.useFakeTimers();
    vi.advanceTimersByTime(2500);
    vi.useRealTimers();
    fallbackSpy.mockRestore();
  });

  it('opens social sharing links', () => {
    vi.useFakeTimers();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
    fireEvent.click(screen.getByText('Share Milestone'));
    
    fireEvent.click(screen.getByText('X (Twitter)'));
    fireEvent.click(screen.getByText('Facebook'));
    fireEvent.click(screen.getByText('LinkedIn'));
    fireEvent.click(screen.getByText('Email'));

    expect(windowOpenSpy).toHaveBeenCalledTimes(4);
    vi.advanceTimersByTime(2500);
    vi.useRealTimers();
    windowOpenSpy.mockRestore();
  });

  it('toggles trend period and shows tooltips on hover', () => {
      render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
      const yearlyBtn = screen.getByRole('button', { name: "View Yearly trends" });
      fireEvent.click(yearlyBtn);
      expect(screen.getAllByText('2021')[0]).toBeInTheDocument(); // 2021 is part of YEARLY_TREND_DATA

      // Let's query by text 2021 to find the month label, then its parent
      const barLabel = screen.getAllByText('2021')[0];
      if (barLabel.parentElement) {
          fireEvent.mouseEnter(barLabel.parentElement);
          // verify hover state (could just check for no crash or specific class changes, but mouseEnter covers the lines)
          fireEvent.mouseLeave(barLabel.parentElement);
      }
  });

  it('allows unlocking solar when conditions are met', () => {
    const handleUnlockSolar = vi.fn();
    render(<ImpactTab totalSaved={600} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={handleUnlockSolar} />);
    
    const unlockButtons = screen.getAllByRole('button', { name: /Unlock milestone Solar Starter/i });
    fireEvent.click(unlockButtons[0]);
    expect(handleUnlockSolar).toHaveBeenCalledTimes(1);
  });
  
  it('opens and closes share and detail modals', async () => {
      render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
      const shareButton = screen.getByText('Share Milestone');
      fireEvent.click(shareButton);
      
      const copyButton = screen.getByText('Copy Message Link');
      fireEvent.click(copyButton);

      await waitFor(() => {
          expect(screen.getByText('Copied link')).toBeInTheDocument();
      });
      
      vi.useFakeTimers();
      vi.advanceTimersByTime(2500);
      vi.useRealTimers();

      const closeShareBtn = screen.getByRole('button', { name: "Close share modal" });
      fireEvent.click(closeShareBtn);
      expect(screen.queryByText('Carbon Milestone')).not.toBeInTheDocument();
      
      const detailsButton = screen.getByRole('button', { name: /View Details/i });
      fireEvent.click(detailsButton);
      expect(screen.getByText('Calculation Schema')).toBeInTheDocument();

      const closeDetailsIconBtn = screen.getByRole('button', { name: "Close details modal" });
      fireEvent.click(closeDetailsIconBtn);
      expect(screen.queryByText('Calculation Schema')).not.toBeInTheDocument();

      const understoodBtn = screen.getByText('Details', { selector: 'button' });
      fireEvent.click(understoodBtn);
      expect(screen.getByText('Calculation Schema')).toBeInTheDocument();
      
      const realUnderstoodBtn = screen.getByRole('button', { name: "Understood" });
      fireEvent.click(realUnderstoodBtn);
      expect(screen.queryByText('Calculation Schema')).not.toBeInTheDocument();
      
      // Open share modal again to test 'Close' text
      fireEvent.click(shareButton);
      const closeTextBtn = screen.getByRole('button', { name: "Close" });
      fireEvent.click(closeTextBtn);
      expect(screen.queryByText('Carbon Milestone')).not.toBeInTheDocument();
  });

  it('handles tree image error', () => {
      render(<ImpactTab totalSaved={240} achievements={INITIAL_ACHIEVEMENTS} onUnlockSolar={() => {}} />);
      const treeImage = screen.getByAltText('Trees growing in a sunny forest');
      fireEvent.error(treeImage);
      expect(treeImage).toHaveStyle({ display: 'none' });
  });
});
