import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimerSection from '../TimerSection';

// Mock timer
jest.useFakeTimers();

describe('TimerSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.useFakeTimers();
    });

    it('should render with default 25:00 timer', () => {
        render(<TimerSection />);

        expect(screen.getByText('Timer')).toBeInTheDocument();
        expect(screen.getByText('25:00')).toBeInTheDocument();
        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('should start timer when start button is clicked', () => {
        render(<TimerSection />);

        const startButton = screen.getByText('Start');
        fireEvent.click(startButton);

        expect(screen.getByText('Pause')).toBeInTheDocument();
    });

    it('should pause timer when pause button is clicked', () => {
        render(<TimerSection />);

        const startButton = screen.getByText('Start');
        fireEvent.click(startButton);

        const pauseButton = screen.getByText('Pause');
        fireEvent.click(pauseButton);

        expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('should countdown timer correctly', () => {
        render(<TimerSection />);

        const startButton = screen.getByText('Start');

        act(() => {
            fireEvent.click(startButton);
        });

        expect(screen.getByText('25:00')).toBeInTheDocument();

        // Advance by 1 second
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.getByText('24:59')).toBeInTheDocument();

        // Advance by 59 more seconds
        act(() => {
            jest.advanceTimersByTime(59000);
        });

        expect(screen.getByText('24:00')).toBeInTheDocument();
    });

    it('should reset timer to initial value', async () => {
        render(<TimerSection />);

        const startButton = screen.getByText('Start');

        act(() => {
            fireEvent.click(startButton);
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.getByText('24:55')).toBeInTheDocument();

        const resetButton = screen.getByText('Reset');
        fireEvent.click(resetButton);

        expect(screen.getByText('25:00')).toBeInTheDocument();
        expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('should set custom timer value', () => {
        render(<TimerSection />);

        const input = screen.getByPlaceholderText('Minutes');
        const setButton = screen.getByText('Set');

        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.click(setButton);

        expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    it('should show notification when timer finishes', () => {
        render(<TimerSection />);

        const input = screen.getByPlaceholderText('Minutes');
        const setButton = screen.getByText('Set');

        // Set to 0 minutes to test edge case - but component enforces min 1
        fireEvent.change(input, { target: { value: '1' } });
        fireEvent.click(setButton);

        const startButton = screen.getByText('Start');

        act(() => {
            fireEvent.click(startButton);
        });

        // Advance timer to finish
        act(() => {
            jest.advanceTimersByTime(61000); // 1 minute + 1 second buffer
        });

        expect(window.api.showNotification).toHaveBeenCalledWith({
            title: 'Timer Finished!',
            body: 'Your timer has completed.',
        });

        expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('should display timer in correct format with leading zeros', () => {
        render(<TimerSection />);

        const input = screen.getByPlaceholderText('Minutes');
        const setButton = screen.getByText('Set');

        fireEvent.change(input, { target: { value: '5' } });
        fireEvent.click(setButton);

        expect(screen.getByText('05:00')).toBeInTheDocument();

        const startButton = screen.getByText('Start');

        act(() => {
            fireEvent.click(startButton);
        });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(screen.getByText('04:59')).toBeInTheDocument();
    });

    it('should enforce minimum value of 1 minute', () => {
        render(<TimerSection />);

        const input = screen.getByPlaceholderText('Minutes');

        fireEvent.change(input, { target: { value: '0' } });

        // Component should enforce minimum of 1
        expect(input).toHaveValue(1);
    });
});
