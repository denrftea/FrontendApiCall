import './components/loading-indicator.js';
import './components/note-list.js';
import './components/note-form.js';
import './components/archive-list.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const noteList = document.createElement('note-list');
  const archiveList = document.createElement('archive-list');
  const noteForm = document.querySelector('note-form');

  app.appendChild(noteList);
  app.appendChild(archiveList);

  const showLoading = () => {
    const loadingIndicator = document.createElement('loading-indicator');
    app.appendChild(loadingIndicator);
  };

  const hideLoading = () => {
    const loadingIndicator = document.querySelector('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  };

  document.addEventListener('loading-start', showLoading);
  document.addEventListener('loading-end', hideLoading);

  // Trigger loading immediately for demonstration
  document.dispatchEvent(new CustomEvent('loading-start'));
  setTimeout(() => document.dispatchEvent(new CustomEvent('loading-end')), 5000);

  noteForm.addEventListener('note-added', async () => {
    showLoading();
    await noteList.loadNotes();
    hideLoading();
  });

  noteList.addEventListener('delete-note', async (e) => {
    showLoading();
    const noteId = e.detail;
    await noteList.deleteNote(noteId);
    hideLoading();
  });

  noteList.addEventListener('archive-note', async (e) => {
    showLoading();
    const noteId = e.detail;
    await noteList.archiveNote(noteId);
    await archiveList.loadArchivedNotes();
    hideLoading();
  });
});