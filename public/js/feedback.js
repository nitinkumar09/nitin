let speech = new SpeechSynthesisUtterance();

let voices = [];

let voiceSelect = document.querySelector("select");
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)))
};


// name insert js start

// Get the username from the user
var username = prompt("Please enter your name:");

// Check if the user entered a name
if (username !== null && username.trim() !== "") {
    // Get the element with the "name" class and set its innerHTML to the username
    document.querySelector(".name").innerHTML = username;
} else {
    // If the user didn't enter a name or clicked cancel, display a default message
    username = "unknown person Because you did not mention your name"
    document.querySelector(".name").innerHTML = "Guest";
}

// name insert js end




document.querySelector("button").addEventListener("click", () => {
    // Get the textarea element
    var textarea = document.getElementById("myTextarea");

    // Set the value of the textarea to an empty string
    textarea.value = "";

    speech.text = `Thank you for feedback ${username} Brother`;
    window.speechSynthesis.speak(speech);
    alert(`Thank you for feedback ${username} Brother .........`)
})
