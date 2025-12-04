# API Documentation

Nexus exposes a secure API to the renderer process via `window.api`. This allows the frontend to interact with the system, database, and file system.

## Notes

-   `getNotes()`: Retrieve all notes.
-   `addNote(data)`: Create a new note.
-   `updateNote(data)`: Update an existing note.
-   `deleteNote(id)`: Delete a note by ID.

## Tasks

-   `getTasks()`: Retrieve all tasks.
-   `addTask(data)`: Create a new task.
-   `updateTask(data)`: Update an existing task.
-   `deleteTask(id)`: Delete a task by ID.

## Snippets

-   `getSnippets()`: Retrieve all code snippets.
-   `addSnippet(data)`: Create a new snippet.
-   `deleteSnippet(id)`: Delete a snippet by ID.

## RSS

-   `getRssFeeds()`: Retrieve all subscribed RSS feeds.
-   `getRssItems(params)`: Retrieve RSS items (articles).
-   `addRssFeed(url)`: Subscribe to a new RSS feed.
-   `toggleReadLater(data)`: Mark an item as read later.
-   `deleteRssFeed(id)`: Unsubscribe from a feed.

## System & Config

-   `getGridLayout()`: Get the saved dashboard layout.
-   `updateGridLayout(layout)`: Save the dashboard layout.
-   `getTheme()`: Get the current application theme.
-   `setTheme(theme)`: Set the application theme.
-   `exportData()`: Export all user data to JSON.
-   `importData(data)`: Import user data from JSON.
-   `showNotification(data)`: Show a system notification.

## Events

-   `onRssUpdated(callback)`: Listen for RSS feed updates.
-   `onTasksUpdated(callback)`: Listen for task updates.
