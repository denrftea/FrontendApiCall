const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const notes = {
  async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  },

  async addNote(title, body) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });
      const responseJson = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  },

  async deleteNote(id) {
    try {
      await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  },

  // Tambahkan metode untuk mengarsipkan catatan
  async archiveNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
        method: 'POST',
      });
      const responseJson = await response.json();
      return responseJson.message; // Mengembalikan pesan dari server
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  },

  async unarchiveNote(id) {
    try {
      await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error unarchiving note:', error);
    }
  },

  // Tambahkan metode untuk mendapatkan semua catatan yang diarsipkan
  async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      const responseJson = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error('Error fetching archived notes:', error);
      return [];
    }
  }
};

export default notes;
