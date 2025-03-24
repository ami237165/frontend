window.addEventListener('DOMContentLoaded', () => {
    alert("chat loaded")

    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("no token")
        window.location.href = 'index.html';
        return;
    }
    const decodedToken = parseJwt(token);
    const socket = io('http://localhost:3000',{
        query:{userId:decodedToken.mobileNumber}
    });
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    const remainingTime = (decodedToken.exp - currentTime) * 1000; // Convert to ms

    //decoding jwt
    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    //join room
    socket.emit('join', decodedToken.mobileNumber);

    //sending message
    document.getElementById('send').addEventListener('click', () => {
        const message = document.getElementById('message').value;
        const receiver = document.getElementById('receiver').value == decodedToken.mobileNumber ? alert("you sent mes to your self") : document.getElementById('receiver').value;

        if (!message || !receiver) {
            alert('Please enter a message and receiver ID');
            return;
        }

        socket.emit('message', {
            sender: decodedToken.mobileNumber,
            receiver ,
            message,
        });

        displayMessage(`You: ${message}`, 'right');
        document.getElementById('message').value = '';
    })

    //message received 
    socket.on('message', (data) => {
        console.log("tatatata ,",data);
        
        displayMessage(`${data.sender}: ${data.message}`, 'left');
    });


    // Helper to display messages
    function displayMessage(text, position) {
        const chatWindow = document.getElementById('chat-window');
        const div = document.createElement('div');
        div.textContent = text;
        div.classList.add(position === 'left' ? 'received' : 'sent');
        chatWindow.appendChild(div);
    }

    if (decodedToken.exp && decodedToken.exp < currentTime) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('access_token');
        window.location.href = 'index.html';
    }
    setTimeout(() => {
        alert('Session expired. Please login again.');
        localStorage.removeItem('access_token');
        window.location.href = 'index.html';
    }, remainingTime);
});