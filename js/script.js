// Authentication and Note Management
document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const notesSection = document.getElementById('notes-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const addNoteBtn = document.getElementById('add-note-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const notesContainer = document.getElementById('notes-container');
    const noteTemplate = document.querySelector('.note-template');

    // Toggle between login and register
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
    
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        // Use FormData for more robust form submission
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
    
        fetch('php/register.php', {
            method: 'POST',
            body: formData  // Use FormData instead of manual encoding
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(result => {
            if (result.status === 'success') {
                alert('Registration successful');
                loginSection.style.display = 'block';
                registerSection.style.display = 'none';
            }
        })
        .catch(error => {
            alert('Registration failed: ' + (error.error || 'Unknown error'));
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
    
        fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.text())
        .then(result => {
            console.log("Server Response:", result);
    
            if (result.includes("Login successful")) {
                loginSection.style.display = 'none';
                notesSection.style.display = 'block';
                loadNotes();
            } else if (result.includes("Password mismatch")) {
                alert("Incorrect password. Please try again.");
            } else if (result.includes("User not found")) {
                alert("User does not exist. Please register.");
            } else {
                alert("Login failed: " + result);
            }
        })
        .catch(error => console.error('Error:', error));
    });
    

    // Add new note
    addNoteBtn.addEventListener('click', () => {
        const newNote = noteTemplate.cloneNode(true);
        newNote.classList.remove('note-template');
        newNote.style.display = 'block';
        
        // Add event listeners to save and delete buttons
        const saveBtn = newNote.querySelector('.save-note');
        const deleteBtn = newNote.querySelector('.delete-note');
        
        saveBtn.addEventListener('click', () => saveNote(newNote));
        deleteBtn.addEventListener('click', () => deleteNote(newNote));
        
        notesContainer.appendChild(newNote);
    });

    // Save note function
    function saveNote(noteElement) {
        const title = noteElement.querySelector('input[name="title"]').value;
        const body = noteElement.querySelector('textarea[name="body"]').value;

        fetch('php/save-note.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
        })
        .then(response => response.text())
        .then(result => {
            if (result === 'success') {
                alert('Note saved successfully');
                loadNotes();
            } else {
                alert('Failed to save note');
            }
        });
    }

    // Delete note function
    function deleteNote(noteElement) {
        noteElement.remove();
    }

    // Load notes function
    function loadNotes() {
        fetch('php/load-notes.php')
        .then(response => response.json())
        .then(notes => {
            // Clear existing notes (except template)
            const existingNotes = notesContainer.querySelectorAll('.note:not(.note-template)');
            existingNotes.forEach(note => note.remove());

            // Create notes from database
            notes.forEach(note => {
                const newNote = noteTemplate.cloneNode(true);
                newNote.classList.remove('note-template');
                newNote.style.display = 'block';
                
                newNote.querySelector('input[name="title"]').value = note.title;
                newNote.querySelector('textarea[name="body"]').value = note.body;
                
                const saveBtn = newNote.querySelector('.save-note');
                const deleteBtn = newNote.querySelector('.delete-note');
                
                saveBtn.addEventListener('click', () => saveNote(newNote));
                deleteBtn.addEventListener('click', () => deleteNote(newNote));
                
                notesContainer.appendChild(newNote);
            });
        });
    }

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        fetch('php/logout.php')
        .then(response => response.text())
        .then(result => {
            if (result === 'success') {
                notesSection.style.display = 'none';
                loginSection.style.display = 'block';
            }
        });
    });
});