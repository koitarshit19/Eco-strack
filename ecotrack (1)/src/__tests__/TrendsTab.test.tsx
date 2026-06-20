import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TrendsTab from '../components/TrendsTab';
import { INITIAL_LOGGED_ACTIVITIES } from '../data';

describe('TrendsTab Component', () => {
    it('renders the trends chart container', () => {
        render(<TrendsTab loggedActivities={INITIAL_LOGGED_ACTIVITIES} />);
        expect(screen.getByText('Climate Performance & Trends')).toBeInTheDocument();
        expect(screen.getAllByText('Transport')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Food')[0]).toBeInTheDocument();
    });

    it('displays Energy Saving as active segment', () => {
        const activities = [
            { id: 'act-3', category: 'Energy' as const, name: 'Cold Wash', saved: 5, unit: 'load', value: 1, timestamp: new Date(), dateStr: 'Today' }
        ];
        render(<TrendsTab loggedActivities={activities} />);
        expect(screen.getByText('Energy Saving')).toBeInTheDocument();
    });

    it('displays Food & Diet as active segment', () => {
        const activities = [
            { id: 'act-3', category: 'Food' as const, name: 'Meal', saved: 5, unit: 'meal', value: 1, timestamp: new Date(), dateStr: 'Today' }
        ];
        render(<TrendsTab loggedActivities={activities} />);
        expect(screen.getByText('Food & Diet')).toBeInTheDocument();
    });

    it('can toggle filters', () => {
        render(<TrendsTab loggedActivities={INITIAL_LOGGED_ACTIVITIES} />);
        const energyBtn = screen.getByRole('button', { name: /Filter logs to showing Energy/i });
        fireEvent.click(energyBtn);
        expect(energyBtn).toHaveClass('bg-primary');
    });

    it('renders with empty loggedActivities covering totalWeight fallback', () => {
        render(<TrendsTab loggedActivities={[]} />);
        expect(screen.getByText('Climate Performance & Trends')).toBeInTheDocument();
    });
});
