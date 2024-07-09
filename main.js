document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyDPKhtwMTmAors7T2UuY7dnLFRPq4UZrfs",
        authDomain: "arabflaqiss.firebaseapp.com",
        databaseURL: "https://arabflaqiss-default-rtdb.firebaseio.com",
        projectId: "arabflaqiss",
        storageBucket: "arabflaqiss.appspot.com",
        messagingSenderId: "114538014171",
        appId: "1:114538014171:web",
        measurementId: "G-KZ7LDKF6BW"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    const randomUsernames = [
        "User123", "Anonymous123", "ChatUser456", "RandomUser789", "GuestUser321"
    ];

    const forbiddenUsernames = [
        "Admin", "Moderator", "BlockedUser", "ArabFlaqis", "Arab-Flaqis", "xnxx", "fuck", "sex",
        "احا", "زبر", "كس", "كوس", "كسمك", "صاحب الموقع", "الادارة", "فلاقيس العرب", "mydick",
        "dick", "ass", "your ass", "fuck you", "كسمين", "InappropriateName", "NewForbiddenUsername"
    ];

    // Get username from localStorage or generate a random one
    let username = localStorage.getItem('username') || getRandomUsername();

    if (!username || forbiddenUsernames.includes(username)) {
        username = getRandomUsername();
        localStorage.setItem('username', username);
    }

    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const emojiBtn = document.getElementById('emoji-btn');
    const messagesContainer = document.getElementById('messages');
    const emojiContainer = document.getElementById('emoji-container');
    const chatTitle = document.getElementById('chat-title');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const confirmBtn = document.getElementById('confirm-password-btn');
    const setUsernameBtn = document.getElementById('set-username-btn');
    const usernameContainer = document.getElementById('username-container');
    const passwordContainer = document.getElementById('password-container');

    const adminPassword = '2001259';
    let isChatDisabled = localStorage.getItem('chatDisabled') === 'true';

    if (localStorage.getItem('isAdmin') === 'true') {
        showAdminControls();
    }

    setUsernameBtn.addEventListener('click', function() {
        const enteredUsername = usernameInput.value.trim();
        if (enteredUsername) {
            if (!isUsernameAllowed(enteredUsername)) {
                alert('This username is not allowed.');
                return;
            }
            if (enteredUsername === '👑 ArabFlaqis 👑') {
                passwordContainer.style.display = 'block';
            } else {
                username = enteredUsername;
                localStorage.setItem('username', username);
                showChatInput();
            }
        }
    });

    confirmBtn.addEventListener('click', function() {
        const enteredPassword = passwordInput.value.trim();
        if (enteredPassword === adminPassword) {
            localStorage.setItem('isAdmin', 'true');
            showAdminControls();
            if (username === '👑 ArabFlaqis 👑') {
                showUsernameInput();
            } else {
                showChatInput();
                localStorage.setItem('username', username);
            }
        } else {
            alert('Incorrect password.');
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    emojiBtn.addEventListener('click', () => {
        emojiContainer.style.display = emojiContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', () => {
            chatInput.value += emoji.textContent;
            emojiContainer.style.display = 'none';
        });
    });

    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    function getRandomUsername() {
        return randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) {
            alert('Please enter a message.');
            return;
        }
        if (!isValidMessage(message)) {
            alert('Your message contains inappropriate content or URLs.');
            return;
        }
        const messagesRef = database.ref('messages');
        messagesRef.push({
            username: username,
            text: message
        });
        chatInput.value = '';
    }

    function showChatInput() {
        chatInput.style.display = 'block';
        sendBtn.style.display = 'block';
        usernameContainer.style.display = 'none';
        passwordContainer.style.display = 'none';
    }

    function isValidMessage(message) {
        // Regex to detect URLs
        const urlPattern = /https?:\/\/[^\s]+/g;
        // Forbidden words list
        const forbiddenWords = ["badword1", "badword2", "badword3"];
        return !urlPattern.test(message) && !forbiddenWords.some(word => message.includes(word));
    }

    function isUsernameAllowed(username) {
        return !forbiddenUsernames.includes(username);
    }

    const messagesRef = database.ref('messages');
    messagesRef.on('child_added', function(snapshot) {
        const message = snapshot.val();
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${message.username}: ${message.text}`;
        messagesContainer.appendChild(messageDiv);
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        // Play notification sound
        document.getElementById('notification-sound').play();
    });

    // Initially check if chat is disabled
    toggleChat();

    function toggleChat() {
        chatInput.disabled = isChatDisabled;
        sendBtn.disabled = isChatDisabled;
        chatTitle.textContent = isChatDisabled ? 'Chat (Disabled)' : 'Chat';
    }
});
