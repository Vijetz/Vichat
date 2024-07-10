const socket = io('http://localhost:4100');

//Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages
var audio = new Audio('../static/alert_tone.mp3');

//Function which will append event into the container
const appendinc = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    if(position == 'left'){
        audio.play();
    }
    messageContainer.append(messageElement);
}

//Ask new user for his/her name and let the server know
let names = prompt("Enter your name to join");

if (names === null || names.trim() === "") {
    // If the user clicked "Cancel" or entered nothing
    // Generate three random digits and concatenate them to "Anonymous"
    const randomDigits = Math.floor(Math.random() * 1000);
    names = "Anonymous" + randomDigits;
} else {
    // User entered a name
    names = names.trim(); // Remove leading and trailing whitespaces
}

socket.emit('new-user-joined', names);

//If a new user joins, receive his/her name from the server
socket.on('user-joined', name=>{
    appendinc(`${name} joined the chat`, 'middle')
})

// If server sends a message, receive it
socket.on('receive', data => {
   
    // Append the new message
    appendinc(`${data.name}: ${data.message}`, 'left');
    
    // Scroll to the bottom if the user was already at the bottom
    const isAtBottom = messageContainer.scrollHeight - messageContainer.scrollTop <= messageContainer.clientHeight + 80;
    if (isAtBottom) {
        setTimeout(() => {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 0);
    }
});

//If a user leaves the chat, sppend the info to the container
socket.on('leave', data=>{
    appendinc(`${data} left the chat`, 'middle')
})

//If the form get submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    appendinc(`You: ${message}`, 'right');
    socket.emit('bhej', message);
    
     // Scroll to the bottom of the messageContainer
     messageContainer.scrollTop = messageContainer.scrollHeight;

     // Reset the text field after a short delay
     setTimeout(() => {
         messageInput.value = '';
     }, 0);

    messageInput.value = '';
})