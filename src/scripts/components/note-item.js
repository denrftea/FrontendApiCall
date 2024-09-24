// src/components/note-item.js
class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setNote(note) {
    this.note = note;
    this.render();
  }
  setNote(note, isArchived = false) {
    this.note = note;
    this.isArchived = isArchived;
    this.render();
  }


  render() {
    this.shadowRoot.innerHTML = `
     <style>
        .note {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 10px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 10px;
        }

        .note h3 {
          margin: 0;
          font-size: 1.5em;
          color: #333;
        }

        .note p {
          margin: 10px 0;
          color: #555;
          font-size: 0.6em;
        }

        .note-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .note button {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
          font-size: 0.9em;
        }

        .delete-button {
          background-color: #e74c3c;
          width: 100px;
        }

        .delete-button:hover {
          background-color: #c0392b;
        }

        #action-button {
          background-color: #3498db;
        }

        #action-button:hover {
          background-color: #2980b9;
        }
      </style>
      <div class="note">
        <h3>${this.note.title}
        <p>${this.note.body}</p>
       <button class="delete-button" id="delete-button">Delete</button>
         <button id="action-button">${this.isArchived ? 'Unarchive' : 'Archive'}</button>
      </div>
    `;

    this.shadowRoot.querySelector('#action-button').addEventListener('click', () => {
      const eventName = this.isArchived ? 'unarchive-note' : 'archive-note';
      this.dispatchEvent(new CustomEvent(eventName, {
        detail: this.note.id,
        bubbles: true,
        composed: true
      }));
    });

    this.shadowRoot.querySelector('#delete-button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-note', {
        detail: this.note.id,
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('note-item', NoteItem);
