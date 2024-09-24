import Swal from 'sweetalert2';
import anime from 'animejs';

export function renderNotes(notes) {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button class="delete-note" data-id="${note.id}">Delete</button>
            <button class="archive-note" data-id="${note.id}">${note.archived ? 'Unarchive' : 'Archive'}</button>
        `;
        notesContainer.appendChild(noteElement);

        anime({
            targets: noteElement,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutExpo'
        });
    });
}

export function renderLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    if (isLoading) {
        loadingElement.classList.remove('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

export function showErrorMessage(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}