document.addEventListener('DOMContentLoaded', function() {
    const deleteChatBtn = document.getElementById('delete-chat-btn');
    const banUserBtn = document.getElementById('ban-user-btn');
    const disableChatBtn = document.getElementById('disable-chat-btn');
    const changeUsernameBtn = document.getElementById('change-username-btn');
    const database = firebase.database();
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatTitle = document.getElementById('chat-title');
    let isChatDisabled = localStorage.getItem('chatDisabled') === 'true';

    deleteChatBtn.addEventListener('click', deleteChat);
    banUserBtn.addEventListener('click', banUser);
    disableChatBtn.addEventListener('click', disableChat);
    changeUsernameBtn.addEventListener('click', changeUsername);

    function showAdminControls() {
        document.getElementById('admin-controls-container').style.display = 'flex';
    }

    function deleteChat() {
        if (confirm('Are you sure you want to delete all chat messages?')) {
            const messagesRef = database.ref('messages');
            messagesRef.remove()
                .then(() => {
                    alert('All chat messages have been deleted.');
                })
                .catch(error => {
                    alert('Error deleting messages: ' + error.message);
                });
        }
    }

    function banUser() {
        const usernameToBan = prompt('Enter the username to ban:');
        if (usernameToBan) {
            localStorage.setItem('bannedUser', usernameToBan);
            alert(`${usernameToBan} has been banned.`);
        }
    }

    function disableChat() {
        isChatDisabled = !isChatDisabled;
        localStorage.setItem('chatDisabled', isChatDisabled);
        toggleChat();
        alert(`Chat has been ${isChatDisabled ? 'disabled' : 'enabled'}.`);
    }

    function changeUsername() {
        const newUsername = prompt('Enter your new username:');
        if (newUsername) {
            localStorage.setItem('username', newUsername);
            alert(`Your username has been changed to ${newUsername}.`);
        }
    }

    function toggleChat() {
        chatInput.disabled = isChatDisabled;
        sendBtn.disabled = isChatDisabled;
        chatTitle.textContent = isChatDisabled ? 'Chat (Disabled)' : 'Chat';
    }
});
