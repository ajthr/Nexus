import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/Navbar';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Rss: () => <div data-testid="icon-rss" />,
    Download: () => <div data-testid="icon-download" />,
    Upload: () => <div data-testid="icon-upload" />,
    Sun: () => <div data-testid="icon-sun" />,
    Moon: () => <div data-testid="icon-moon" />,
    Monitor: () => <div data-testid="icon-monitor" />,
    Palette: () => <div data-testid="icon-palette" />,
    ChevronDown: () => <div data-testid="icon-chevron-down" />,
}));

describe('Navbar Component', () => {
    const mockProps = {
        theme: 'light',
        onThemeChange: jest.fn(),
        colorTheme: 'amethyst',
        toggleColorTheme: jest.fn(),
        customColor: '#6366f1',
        setCustomColor: jest.fn(),
        availableThemes: ['amethyst', 'sky', 'emerald'],
        setSpecificColorTheme: jest.fn(),
        onRssClick: jest.fn(),
        onExport: jest.fn(),
        onImport: jest.fn(),
    };

    it('renders correctly', () => {
        render(<Navbar {...mockProps} />);
        expect(screen.getByText('Nexus')).toBeInTheDocument();
    });

    it('opens color menu when clicking the palette button', () => {
        render(<Navbar {...mockProps} />);
        const colorButton = screen.getByTitle('Color Theme');
        fireEvent.click(colorButton);

        expect(screen.getByText('Presets')).toBeInTheDocument();
        expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('calls setSpecificColorTheme when a preset is clicked', () => {
        render(<Navbar {...mockProps} />);
        const colorButton = screen.getByTitle('Color Theme');
        fireEvent.click(colorButton);

        const skyPreset = screen.getByLabelText('Select sky theme');
        fireEvent.click(skyPreset);

        expect(mockProps.setSpecificColorTheme).toHaveBeenCalledWith('sky');
    });

    it('shows custom color picker option', () => {
        render(<Navbar {...mockProps} />);
        const colorButton = screen.getByTitle('Color Theme');
        fireEvent.click(colorButton);

        expect(screen.getByText('Pick Color')).toBeInTheDocument();
    });
});
