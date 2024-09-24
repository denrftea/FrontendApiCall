import notes from '../data/api.js';
import '../../style.css';

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    this.shadowRoot.getElementById('note-title').addEventListener('input', this.validateTitle.bind(this));
    this.shadowRoot.getElementById('note-body').addEventListener('input', this.validateBody.bind(this));
    
    // Listen for loading events to handle UI changes
    this.addEventListener('loading-start', this.showLoading.bind(this));
    this.addEventListener('loading-end', this.hideLoading.bind(this));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Copy CSS here if needed */
        form {
          display: flex;
          flex-direction: column;
          gap: 15px; /* Increased gap between elements */
          padding: 20px;
          border: 1px solid #93e8ed;
          border-radius: 8px;
          background-color: #f9f9f9;
          min-width: 200px; /* Perkecil lebar minimum */
          min-height: 250px; /* Perkecil tinggi minimum */
        }

        input, textarea {
          padding: 8px; /* Perkecil padding */
          border: 1px solid #93e8ed;
          border-radius: 4px;
          font-size: 14px; /* Perkecil ukuran font */
          width: 100%; /* Ensure full width */
        }

        textarea {
          resize: vertical;
          min-height: 50px; /* Perkecil tinggi minimum */
        }

        button {
          padding: 8px 12px; /* Perkecil padding */
          border: none;
          background-color: #e30ce3;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          width: 150px;
          align-self: center; /* Center button horizontally */
        }

        button:hover {
          background-color: #0de386;
        }

        .header {
          height: 75px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #93e8ed;
          margin-bottom: 10px;
        }

        .error {
          color: red;
          font-size: 12px; /* Perkecil ukuran font */
        }

        .loading {
          opacity: 0.5;
          pointer-events: none;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #93e8ed;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

      </style>
      <div class="header">
        <h2>Catatan Kegiatan</h2>
      </div>
      <form>
        <div>
          <input type="text" id="note-title" placeholder="Judul Kegiatan" required>
          <div id="title-error" class="error"></div>
        </div>
        <div>
          <textarea id="note-body" placeholder="Isi Kegiatan" required></textarea>
          <div id="body-error" class="error"></div>
        </div>
        <button type="submit" id="submit-button">Tambah Giat</button>
        <div id="loading-spinner" class="spinner" style="display: none;"></div>
      </form>
    `;
  }

  showLoading() {
    this.shadowRoot.getElementById('loading-spinner').style.display = 'block';
    this.shadowRoot.querySelector('form').classList.add('loading');
    this.shadowRoot.getElementById('submit-button').disabled = true;
  }

  hideLoading() {
    this.shadowRoot.getElementById('loading-spinner').style.display = 'none';
    this.shadowRoot.querySelector('form').classList.remove('loading');
    this.shadowRoot.getElementById('submit-button').disabled = false;
  }

  validateTitle() {
    const titleInput = this.shadowRoot.getElementById('note-title');
    const titleError = this.shadowRoot.getElementById('title-error');
    if (titleInput.value.length < 15) {
      titleError.textContent = 'Judul Harus diatas lebih dari 15 Karakter';
      this.shadowRoot.getElementById('submit-button').disabled = true;
    } else {
      titleError.textContent = '';
      this.shadowRoot.getElementById('submit-button').disabled = false;
    }
  }

  validateBody() {
    const bodyInput = this.shadowRoot.getElementById('note-body');
    const bodyError = this.shadowRoot.getElementById('body-error');
    if (bodyInput.value.length < 25) {
      bodyError.textContent = 'Body must be at least 25 characters long.';
      this.shadowRoot.getElementById('submit-button').disabled = true;
    } else {
      bodyError.textContent = '';
      this.shadowRoot.getElementById('submit-button').disabled = false;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const titleInput = this.shadowRoot.getElementById('note-title');
    const bodyInput = this.shadowRoot.getElementById('note-body');

    if (titleInput.value.length < 10 || bodyInput.value.length < 25) {
      return;
    }

    // Trigger the loading-start event
    this.dispatchEvent(new CustomEvent('loading-start', { bubbles: true, composed: true }));
    
    // Simulate adding a note (replace with actual API call)
    await notes.addNote(titleInput.value, bodyInput.value);
    
    // Trigger the loading-end event
    this.dispatchEvent(new CustomEvent('loading-end', { bubbles: true, composed: true }));

    titleInput.value = '';
    bodyInput.value = '';

    // Notify note added
    this.dispatchEvent(new CustomEvent('note-added', { bubbles: true, composed: true }));
  }
}

customElements.define('note-form', NoteForm);
