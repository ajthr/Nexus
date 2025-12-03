import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskSection from '../TaskSection';
import { mockTasks } from '../../test-utils/mocks';

describe('TaskSection', () => {
    const mockOnTaskToggle = jest.fn();
    const mockOnNewTask = jest.fn();
    const mockOnTaskEdit = jest.fn();
    const mockOnTaskDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no tasks', () => {
        render(
            <TaskSection
                tasks={[]}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        expect(screen.getByText('Ready to get productive?')).toBeInTheDocument();
        expect(screen.getByText(/Set priorities, track your progress/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Your First Task/i })).toBeInTheDocument();
    });

    it('should call onNewTask when empty state button is clicked', () => {
        render(
            <TaskSection
                tasks={[]}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        const createButton = screen.getByRole('button', { name: /Create Your First Task/i });
        fireEvent.click(createButton);

        expect(mockOnNewTask).toHaveBeenCalledTimes(1);
    });

    it('should render list of tasks', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('should display task count correctly', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        // 1 incomplete task out of 2 total
        expect(screen.getByText('1/2')).toBeInTheDocument();
    });

    it('should show completed tasks with strikethrough', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        const completedTask = screen.getByText('Test Task 2');
        expect(completedTask).toHaveClass('line-through');
    });

    it('should call onTaskToggle when checkbox is clicked', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);

        expect(mockOnTaskToggle).toHaveBeenCalledWith(1, true);
    });

    it('should call onTaskEdit when edit button is clicked', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        const editButtons = screen.getAllByTitle('Edit task');
        fireEvent.click(editButtons[0]);

        expect(mockOnTaskEdit).toHaveBeenCalledWith(mockTasks[0]);
    });

    it('should call onTaskDelete when delete button is clicked', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        const deleteButtons = screen.getAllByTitle('Delete task');
        fireEvent.click(deleteButtons[0]);

        expect(mockOnTaskDelete).toHaveBeenCalledWith(1);
    });

    it('should display formatted dates', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        expect(screen.getByText(/Jan 20, 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/Jan 21, 2024/i)).toBeInTheDocument();
    });

    it('should show checkboxes as checked for completed tasks', () => {
        render(
            <TaskSection
                tasks={mockTasks}
                onTaskToggle={mockOnTaskToggle}
                onNewTask={mockOnNewTask}
                onTaskEdit={mockOnTaskEdit}
                onTaskDelete={mockOnTaskDelete}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).not.toBeChecked(); // First task is not completed
        expect(checkboxes[1]).toBeChecked(); // Second task is completed
    });
});
