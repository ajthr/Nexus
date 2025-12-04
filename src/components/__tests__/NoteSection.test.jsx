import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteSection from '../NoteSection';
import { mockNotes } from '../../test-utils/mocks';

describe('NoteSection', () => {
    const mockOnNewNote = jest.fn();
    const mockOnNoteEdit = jest.fn();
    const mockOnNoteDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no notes', () => {
        render(
            <NoteSection
                notes={[]}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        expect(screen.getByText('Got an idea? Jot it down.')).toBeInTheDocument();
        expect(screen.getByText(/Use this space for project planning/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create a Note/i })).toBeInTheDocument();
    });

    it('should call onNewNote when empty state button is clicked', () => {
        render(
            <NoteSection
                notes={[]}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        const createButton = screen.getByRole('button', { name: /Create a Note/i });
        fireEvent.click(createButton);

        expect(mockOnNewNote).toHaveBeenCalledTimes(1);
    });

    it('should render list of notes', () => {
        render(
            <NoteSection
                notes={mockNotes}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        expect(screen.getByText('Test Note 1')).toBeInTheDocument();
        expect(screen.getByText('Test Note 2')).toBeInTheDocument();
        expect(screen.getByText('This is test note content 1')).toBeInTheDocument();
        expect(screen.getByText('This is test note content 2')).toBeInTheDocument();
    });

    it('should display note count', () => {
        render(
            <NoteSection
                notes={mockNotes}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should call onNoteEdit when edit button is clicked', () => {
        render(
            <NoteSection
                notes={mockNotes}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        const editButtons = screen.getAllByTitle('Edit note');
        fireEvent.click(editButtons[0]);

        expect(mockOnNoteEdit).toHaveBeenCalledWith(mockNotes[0]);
    });

    it('should call onNoteDelete when delete button is clicked', () => {
        render(
            <NoteSection
                notes={mockNotes}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        const deleteButtons = screen.getAllByTitle('Delete note');
        fireEvent.click(deleteButtons[0]);

        expect(mockOnNoteDelete).toHaveBeenCalledWith(1);
    });

    it('should display formatted dates', () => {
        render(
            <NoteSection
                notes={mockNotes}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/Jan 16, 2024/i)).toBeInTheDocument();
    });

    it('should truncate long content with line-clamp', () => {
        const longNote = {
            id: 1,
            title: 'Long Note',
            content: 'This is a very long content that should be truncated. '.repeat(10),
            created_at: '2024-01-15T10:30:00Z',
        };

        render(
            <NoteSection
                notes={[longNote]}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        const contentElement = screen.getByText(/This is a very long content/i);
        expect(contentElement).toHaveClass('line-clamp-2');
    });

    it('should show both edit and delete buttons for each note', () => {
        render(
            <NoteSection
                notes={mockNotes}
                onNewNote={mockOnNewNote}
                onNoteEdit={mockOnNoteEdit}
                onNoteDelete={mockOnNoteDelete}
            />
        );

        const editButtons = screen.getAllByTitle('Edit note');
        const deleteButtons = screen.getAllByTitle('Delete note');

        expect(editButtons).toHaveLength(2);
        expect(deleteButtons).toHaveLength(2);
    });
});
