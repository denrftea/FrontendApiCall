// src/components/archive-list.js
import notes from '../data/api.js';
import './note-item.js';

class ArchiveList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.loadArchivedNotes(); // Memuat catatan yang diarsipkan ketika komponen terhubung ke DOM
  }

  async loadArchivedNotes() {
    this.dispatchEvent(new CustomEvent('loading-start', { bubbles: true, composed: true }));
    const archivedNotes = await notes.getArchivedNotes();  // Mengambil catatan arsip
    this.render(archivedNotes);  // Render catatan arsip
    this.dispatchEvent(new CustomEvent('loading-end', { bubbles: true, composed: true }));
  }

  async unarchiveNote(id) {
    this.dispatchEvent(new CustomEvent('loading-start', { bubbles: true, composed: true }));
    await notes.unarchiveNote(id);  // Unarchive catatan melalui API
    await this.loadArchivedNotes();  // Muat ulang daftar arsip
    this.dispatchEvent(new CustomEvent('loading-end', { bubbles: true, composed: true }));
  }

  async deleteNote(id) {
    this.dispatchEvent(new CustomEvent('loading-start', { bubbles: true, composed: true }));
    await notes.deleteNote(id);  // Menghapus catatan arsip
    await this.loadArchivedNotes();  // Memuat ulang daftar arsip
    this.dispatchEvent(new CustomEvent('loading-end', { bubbles: true, composed: true }));
  }

  render(archivedNotes) {
    this.shadowRoot.innerHTML = `
    <style>
        h2 {
          font-size: 1.5em;
          color: #cc33cc;
          margin-bottom: 20px;
          text-align: center;
        }

        #archived-notes-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-auto-rows: minmax(200px, auto); /* Mengatur tinggi otomatis berdasarkan konten */
          gap: 20px;
          padding: 0 10px;
        }

        /* Membatasi maksimal 3 card per baris */
        @media (min-width: 600px) {
          #archived-notes-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          #archived-notes-container {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        /* Style to add some margin around each note item */
        note-item {
          display: block;
        }
      </style>
      <h2>Arsip Kegiatan</h2>
      <div id="archived-notes-container"></div>
    `;

    const container = this.shadowRoot.getElementById('archived-notes-container');
    container.innerHTML = '';  // Bersihkan sebelum render ulang

    archivedNotes.forEach(note => {
        const noteItem = document.createElement('note-item');
        noteItem.setNote(note, true);  // Set isArchived = true untuk catatan yang diarsipkan
        container.appendChild(noteItem);
        
        noteItem.addEventListener('delete-note', async (e) => {
            const noteId = e.detail;
            await this.deleteNote(noteId);  // Delete catatan arsip
          });
        // Tambahkan event listener untuk unarchive
        noteItem.addEventListener('unarchive-note', async (e) => {
          const noteId = e.detail;
          await this.unarchiveNote(noteId);  // Unarchive catatan
          document.querySelector('note-list').loadNotes();  // Muat ulang daftar catatan aktif
        });
      });
  }
}

customElements.define('archive-list', ArchiveList);
