import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SnippetSection from '../SnippetSection';
import { mockSnippets } from '../../test-utils/mocks';

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
    },
});

describe('SnippetSection', () => {
    const mockOnNewSnippet = jest.fn();
    const mockOnSnippetDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no snippets', () => {
        render(
            <SnippetSection
                snippets={[]}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        expect(screen.getByText('Save Time. Paste Smarter.')).toBeInTheDocument();
        expect(screen.getByText(/Store reusable code blocks/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /New Snippet/i })).toBeInTheDocument();
    });

    it('should call onNewSnippet when empty state button is clicked', () => {
        render(
            <SnippetSection
                snippets={[]}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        const createButton = screen.getByRole('button', { name: /New Snippet/i });
        fireEvent.click(createButton);

        expect(mockOnNewSnippet).toHaveBeenCalledTimes(1);
    });

    it('should render list of snippets', () => {
        render(
            <SnippetSection
                snippets={mockSnippets}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        expect(screen.getByText('Test Snippet 1')).toBeInTheDocument();
        expect(screen.getByText('Test Snippet 2')).toBeInTheDocument();
        expect(screen.getByText('console.log("Hello World");')).toBeInTheDocument();
        expect(screen.getByText('print("Hello Python")')).toBeInTheDocument();
    });

    it('should display snippet count', () => {
        render(
            <SnippetSection
                snippets={mockSnippets}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should display language badges with correct colors', () => {
        render(
            <SnippetSection
                snippets={mockSnippets}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        const javascriptBadge = screen.getByText('javascript');
        const pythonBadge = screen.getByText('python');

        expect(javascriptBadge).toBeInTheDocument();
        expect(pythonBadge).toBeInTheDocument();

        // Check for color classes
        expect(javascriptBadge).toHaveClass('bg-yellow-100');
        expect(pythonBadge).toHaveClass('bg-blue-100');
    });

    it('should copy snippet to clipboard when copy button is clicked', async () => {
        render(
            <SnippetSection
                snippets={mockSnippets}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        const copyButtons = screen.getAllByTitle('Copy to clipboard');
        fireEvent.click(copyButtons[0]);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('console.log("Hello World");');
    });

    it('should call onSnippetDelete when delete button is clicked', () => {
        render(
            <SnippetSection
                snippets={mockSnippets}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        // Find all buttons, filter to get delete button
        const allButtons = screen.getAllByRole('button');
        // Delete buttons are the odd-indexed ones after copy buttons (1, 3, etc.)
        const deleteButtons = allButtons.filter((_, index) => index % 2 === 1);
        fireEvent.click(deleteButtons[0]);

        expect(mockOnSnippetDelete).toHaveBeenCalledWith(1);
    });

    it('should display code in pre/code blocks', () => {
        render(
            <SnippetSection
                snippets={mockSnippets}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        const codeBlocks = screen.getAllByRole('code');
        expect(codeBlocks.length).toBeGreaterThan(0);
    });

    it('should handle unknown language with default color', () => {
        const unknownLanguageSnippet = [{
            id: 1,
            title: 'Unknown',
            content: 'some code',
            language: 'unknown-lang',
        }];

        render(
            <SnippetSection
                snippets={unknownLanguageSnippet}
                onNewSnippet={mockOnNewSnippet}
                onSnippetDelete={mockOnSnippetDelete}
            />
        );

        const badge = screen.getByText('unknown-lang');
        expect(badge).toHaveClass('bg-gray-100');
    });
});
