import React, { useState } from 'react';
import NoteSection from './NoteSection';
import TaskSection from './TaskSection';
import SnippetSection from './SnippetSection';
import TimerSection from './TimerSection';

function MainContent({
  notes,
  tasks,
  snippets,
  gridLayout,
  onLayoutChange,
  onTaskToggle,
  onNoteEdit,
  onTaskEdit,
  onTaskDelete,
  onSnippetDelete,
  onNoteDelete
}) {
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const newLayout = gridLayout.map(item => item.section_type);
    const draggedItem = newLayout[draggingIndex];
    newLayout.splice(draggingIndex, 1);
    newLayout.splice(index, 0, draggedItem);
    
    onLayoutChange(newLayout);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const renderSection = (sectionType) => {
    switch (sectionType) {
      case 'notes':
        return (
          <NoteSection
            notes={notes}
            onNoteEdit={onNoteEdit}
            onNoteDelete={onNoteDelete}
          />
        );
      case 'tasks':
        return (
          <TaskSection
            tasks={tasks}
            onTaskToggle={onTaskToggle}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
          />
        );
      case 'snippets':
        return (
          <SnippetSection
            snippets={snippets}
            onSnippetDelete={onSnippetDelete}
          />
        );
      case 'timer':
        return <TimerSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-4 overflow-hidden">
      <div className="grid grid-cols-2 auto-rows-fr gap-4 h-full">
        {gridLayout.map((item, index) => (
          <div
            key={item.section_type}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`cursor-move h-full ${draggingIndex === index ? 'opacity-50' : ''
              }`}
          >
            {renderSection(item.section_type)}
          </div>
        ))}
      </div>
    </div>
  );

}

export default MainContent;
