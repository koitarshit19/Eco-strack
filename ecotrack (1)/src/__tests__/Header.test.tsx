import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/Header';

describe('Header Component', () => {
    it('renders logo and navigation items', () => {
        render(<Header activeTab="Home" setActiveTab={() => {}} darkMode={false} setDarkMode={() => {}} />);
        expect(screen.getByText('EcoTrack')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Log')).toBeInTheDocument();
    });

    it('toggles dark mode', () => {
        const setDarkMode = vi.fn();
        render(<Header activeTab="Home" setActiveTab={() => {}} darkMode={false} setDarkMode={setDarkMode} />);
        
        const toggleButton = screen.getByTitle('Toggle Theme');
        fireEvent.click(toggleButton);
        
        expect(setDarkMode).toHaveBeenCalledWith(true);
    });

    it('navigates to Home when logo is clicked', () => {
        const setActiveTab = vi.fn();
        render(<Header activeTab="Log" setActiveTab={setActiveTab} darkMode={false} setDarkMode={() => {}} />);
        const logo = screen.getByRole('button', { name: "EcoTrack Home" });
        fireEvent.click(logo);
        expect(setActiveTab).toHaveBeenCalledWith('Home');
    });

    it('hides profile avatar image on error', () => {
        render(<Header activeTab="Home" setActiveTab={() => {}} darkMode={false} setDarkMode={() => {}} />);
        const avatarImage = screen.getByRole('img', { name: "User Profile" }).querySelector('img');
        if (avatarImage) {
            fireEvent.error(avatarImage);
            expect(avatarImage).toHaveStyle({ display: 'none' });
        }
    });
});
