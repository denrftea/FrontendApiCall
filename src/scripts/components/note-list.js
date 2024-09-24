// src/components/note-list.js
import notes from '../data/api.js';
import './note-item.js';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.loadNotes(); // Memuat catatan ketika komponen terhubung ke DOM
  }

  async loadNotes() {
    this.dispatchEvent(new CustomEvent('loading-start', { bubbles: true, composed: true }));
    const allNotes = await notes.getAllNotes();  // Mengambil semua catatan
    this.render(allNotes);  // Render catatan
    this.dispatchEvent(new CustomEvent('loading-end', { bubbles: true, composed: true }));
  }

  async archiveNote(id) {
    this.dispatchEvent(new CustomEvent('loading-start', { bubbles: true, composed: true }));
    await notes.archiveNote(id);  // Mengarsipkan catatan
    await this.loadNotes();  // Memuat ulang catatan aktif
    this.dispatchEvent(new CustomEvent('loading-end', { bubbles: true, composed: true }));
  }

  async deleteNote(id) {
    this.dispatchEvent(new CustomEvent('loading-start', { bubbles: true, composed: true }));
    await notes.deleteNote(id);  // Menghapus catatan
    await this.loadNotes();  // Memuat ulang catatan aktif
    this.dispatchEvent(new CustomEvent('loading-end', { bubbles: true, composed: true }));
  }

  render(notesData) {
    this.shadowRoot.innerHTML = `
    <style>
        h2 {
          font-size: 1.5em;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }

        #notes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-auto-rows: minmax(200px, auto); /* Mengatur tinggi otomatis berdasarkan konten */
          gap: 20px;
          padding: 0 10px;
        }

        /* Membatasi maksimal 3 card per baris */
        @media (min-width: 600px) {
          #notes-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          #notes-container {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        /* Style to add some margin around each note item */
        note-item {
          display: block;
        }
      </style>
      <h2>Nama Kegiatan</h2>
      <div id="notes-container"></div>
    `;

    const container = this.shadowRoot.getElementById('notes-container');
    container.innerHTML = ''; // Bersihkan sebelum render ulang

    notesData.forEach(note => {
      const noteItem = document.createElement('note-item');
      noteItem.setNote(note);
      container.appendChild(noteItem);

      noteItem.addEventListener('delete-note', async (e) => {
        const noteId = e.detail;
        await this.deleteNote(noteId);  // Delete catatan
      });
    });
  }
}

customElements.define('note-list', NoteList);
