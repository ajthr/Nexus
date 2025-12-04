import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when show is false', () => {
        render(
            <Modal show={false} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );

        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('should render when show is true', () => {
        render(
            <Modal show={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should call onClose when X button is clicked', () => {
        render(
            <Modal show={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );

        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', () => {
        render(
            <Modal show={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should set body overflow to hidden when shown', () => {
        const { unmount } = render(
            <Modal show={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );

        expect(document.body.style.overflow).toBe('hidden');

        unmount();
        expect(document.body.style.overflow).toBe('unset');
    });

    it('should clean up event listeners on unmount', () => {
        const { unmount } = render(
            <Modal show={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );

        unmount();

        fireEvent.keyDown(document, { key: 'Escape' });

        // Should not call onClose after unmount
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should render children correctly', () => {
        render(
            <Modal show={true} onClose={mockOnClose} title="Test Modal">
                <div data-testid="child-content">
                    <p>Paragraph 1</p>
                    <p>Paragraph 2</p>
                </div>
            </Modal>
        );

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
        expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });
});
