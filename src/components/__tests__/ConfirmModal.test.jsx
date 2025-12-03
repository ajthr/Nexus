import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../ConfirmModal';

describe('ConfirmModal', () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with danger type by default', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Delete Item"
                message="Are you sure you want to delete this item?"
            />
        );

        expect(screen.getByText('Delete Item')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should show warning icon for danger type', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Delete Item"
                message="Are you sure?"
                type="danger"
            />
        );

        // Check for alert icon container
        const iconContainer = screen.getByText('Are you sure?').parentElement;
        expect(iconContainer.querySelector('.text-red-600')).toBeInTheDocument();
    });

    it('should not show warning icon for info type', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Information"
                message="This is info"
                type="info"
            />
        );

        const iconContainer = screen.queryByRole('graphics-symbol');
        expect(iconContainer).not.toBeInTheDocument();
    });

    it('should call onConfirm and onClose when confirm button is clicked', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Confirm"
                message="Are you sure?"
            />
        );

        const confirmButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is clicked', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Confirm"
                message="Are you sure?"
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should hide cancel button when hideCancel is true', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Info"
                message="Info message"
                hideCancel={true}
            />
        );

        expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should use custom button text', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Custom"
                message="Custom message"
                confirmText="OK"
                cancelText="No Thanks"
            />
        );

        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'No Thanks' })).toBeInTheDocument();
    });

    it('should apply danger color for danger type', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Delete"
                message="Sure?"
                type="danger"
            />
        );

        const confirmButton = screen.getByRole('button', { name: /delete/i });
        expect(confirmButton).toHaveClass('bg-red-600');
    });

    it('should apply primary color for info type', () => {
        render(
            <ConfirmModal
                show={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Info"
                message="Info"
                type="info"
                confirmText="OK"
            />
        );

        const confirmButton = screen.getByRole('button', { name: 'OK' });
        expect(confirmButton).toHaveClass('bg-primary');
    });

    it('should not render when show is false', () => {
        render(
            <ConfirmModal
                show={false}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Hidden"
                message="Should not show"
            />
        );

        expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });
});
