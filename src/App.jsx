import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MainContent from './components/MainContent';
import NoteModal from './components/NoteModal';
import TaskModal from './components/TaskModal';
import SnippetModal from './components/SnippetModal';
import RssFeedModal from './components/RssFeedModal';
import RssManageModal from './components/RssManageModal';
import ConfirmModal from './components/ConfirmModal';
import { useTheme } from './hooks/useTheme';
import { useColorTheme } from './hooks/useColorTheme';
import { useDatabase } from './hooks/useDatabase';

function App() {
  const { theme, isDark, cycleTheme } = useTheme();
  const { colorTheme, toggleColorTheme, customColor, setCustomColor, availableThemes, setSpecificColorTheme } = useColorTheme();
  const [showRssModal, setShowRssModal] = useState(false);
  const [showRssManageModal, setShowRssManageModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Confirm modal state (used for deletes AND info alerts)
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'danger',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    hideCancel: false,
    onConfirm: null,
  });

  // Fetch data from database
  const { data: notes, refresh: refreshNotes } = useDatabase(() => window.api.getNotes());
  const { data: tasks, refresh: refreshTasks } = useDatabase(() => window.api.getTasks());
  const { data: snippets, refresh: refreshSnippets } = useDatabase(() => window.api.getSnippets());
  const { data: rssItems, refresh: refreshRss } = useDatabase(() => window.api.getRssItems({}));
  const { data: rssFeeds, refresh: refreshFeeds } = useDatabase(() => window.api.getRssFeeds());
  const { data: gridLayout, refresh: refreshLayout } = useDatabase(() => window.api.getGridLayout());

  // Listen for updates
  useEffect(() => {
    const handleRssUpdate = () => refreshRss();
    const handleTasksUpdate = () => refreshTasks();

    window.api.onRssUpdated(handleRssUpdate);
    window.api.onTasksUpdated(handleTasksUpdate);

    return () => {
    };
  }, [refreshRss, refreshTasks]);

  // Helper to show an info-style alert modal
  const showInfoModal = (title, message) => {
    setConfirmModal({
      show: true,
      title,
      message,
      type: 'info',
      confirmText: 'OK',
      cancelText: '',
      hideCancel: true,
      onConfirm: null,
    });
  };

  // Export data
  const handleExport = async () => {
    try {
      const data = await window.api.exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      showInfoModal('Export Failed', 'Failed to export data. Please try again.');
    }
  };

  // Import data
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      try {
        const file = e.target.files[0];
        const text = await file.text();
        const data = JSON.parse(text);
        const result = await window.api.importData(data);
        if (result.success) {
          // Refresh everything
          refreshNotes();
          refreshTasks();
          refreshSnippets();
          refreshRss();
          refreshFeeds();
          refreshLayout();

          showInfoModal('Import Complete', 'Data imported successfully!');
        } else {
          showInfoModal('Import Failed', `Import failed: ${result.error}`);
        }
      } catch (error) {
        console.error('Import failed:', error);
        showInfoModal('Import Failed', 'Failed to import data. Please check the file and try again.');
      }
    };
    input.click();
  };

  // Note handlers
  const handleNoteEdit = (note) => {
    setEditingNote(note);
    setShowNoteModal(true);
  };

  const handleNoteSave = async (note) => {
    if (editingNote) {
      await window.api.updateNote(note);
    } else {
      await window.api.addNote(note);
    }
    setShowNoteModal(false);
    setEditingNote(null);
    refreshNotes();
  };

  const handleNoteDelete = (noteId) => {
    setConfirmModal({
      show: true,
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      hideCancel: false,
      onConfirm: async () => {
        await window.api.deleteNote(noteId);
        refreshNotes();
      },
    });
  };

  // Task handlers
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSave = async (task) => {
    if (editingTask) {
      await window.api.updateTask({
        id: task.id,
        title: task.title,
        scheduledAt: task.scheduledAt,
        completed: editingTask.completed,
      });
    } else {
      await window.api.addTask(task);
    }
    setShowTaskModal(false);
    setEditingTask(null);
    refreshTasks();
  };

  const handleTaskDelete = (taskId) => {
    setConfirmModal({
      show: true,
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      hideCancel: false,
      onConfirm: async () => {
        await window.api.deleteTask(taskId);
        refreshTasks();
      },
    });
  };

  // Snippet handlers
  const handleSnippetDelete = (snippetId) => {
    setConfirmModal({
      show: true,
      title: 'Delete Snippet',
      message: 'Are you sure you want to delete this snippet?',
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      hideCancel: false,
      onConfirm: async () => {
        await window.api.deleteSnippet(snippetId);
        refreshSnippets();
      },
    });
  };

  // RSS handlers
  const handleRssFeedDelete = (feedId) => {
    setConfirmModal({
      show: true,
      title: 'Delete RSS Feed',
      message:
        'Are you sure you want to delete this feed? All items from this feed will also be deleted.',
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      hideCancel: false,
      onConfirm: async () => {
        await window.api.deleteRssFeed(feedId);
        refreshFeeds();
        refreshRss();
      },
    });
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar
          theme={theme}
          onThemeChange={cycleTheme}
          colorTheme={colorTheme}
          toggleColorTheme={toggleColorTheme}
          customColor={customColor}
          setCustomColor={setCustomColor}
          availableThemes={availableThemes}
          setSpecificColorTheme={setSpecificColorTheme}
          onRssClick={() => setShowRssModal(true)}
          onExport={handleExport}
          onImport={handleImport}
        />

        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar
            onNewNote={() => {
              setEditingNote(null);
              setShowNoteModal(true);
            }}
            onNewTask={() => {
              setEditingTask(null);
              setShowTaskModal(true);
            }}
            onNewSnippet={() => setShowSnippetModal(true)}
          />

          <MainContent
            notes={notes || []}
            tasks={tasks || []}
            snippets={snippets || []}
            gridLayout={gridLayout || []}
            onLayoutChange={async (newLayout) => {
              await window.api.updateGridLayout(newLayout);
              refreshLayout();
            }}
            onTaskToggle={async (taskId, completed) => {
              await window.api.updateTask({ id: taskId, completed });
              refreshTasks();
            }}
            onNewNote={() => {
              setEditingNote(null);
              setShowNoteModal(true);
            }}
            onNewTask={() => {
              setEditingTask(null);
              setShowTaskModal(true);
            }}
            onNewSnippet={() => setShowSnippetModal(true)}
            onNoteEdit={handleNoteEdit}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onSnippetDelete={handleSnippetDelete}
            onNoteDelete={handleNoteDelete}
          />

          <RightSidebar
            rssItems={rssItems || []}
            onToggleReadLater={async (itemId, readLater) => {
              await window.api.toggleReadLater({ id: itemId, readLater });
              refreshRss();
            }}
            onManageFeeds={() => setShowRssManageModal(true)}
          />
        </div>

        {/* Modals */}
        <RssFeedModal
          show={showRssModal}
          onClose={() => setShowRssModal(false)}
          onAdd={async (url) => {
            const result = await window.api.addRssFeed(url);
            if (result.success) {
              setShowRssModal(false);
              refreshFeeds();
              refreshRss();
            } else {
              showInfoModal('RSS Add Failed', `Failed to add RSS feed: ${result.error}`);
            }
          }}
        />

        <RssManageModal
          show={showRssManageModal}
          onClose={() => setShowRssManageModal(false)}
          feeds={rssFeeds || []}
          onDelete={handleRssFeedDelete}
        />

        <NoteModal
          show={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setEditingNote(null);
          }}
          onSave={handleNoteSave}
          editNote={editingNote}
        />

        <TaskModal
          show={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={handleTaskSave}
          editTask={editingTask}
        />

        <SnippetModal
          show={showSnippetModal}
          onClose={() => setShowSnippetModal(false)}
          onSave={async (snippet) => {
            await window.api.addSnippet(snippet);
            setShowSnippetModal(false);
            refreshSnippets();
          }}
        />

        <ConfirmModal
          show={confirmModal.show}
          onClose={() =>
            setConfirmModal((prev) => ({
              ...prev,
              show: false,
            }))
          }
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          hideCancel={confirmModal.hideCancel}
        />
      </div>
    </div>
  );
}

export default App;
