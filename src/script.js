


const sendButton = document.getElementById("send");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

sendButton.addEventListener("click", function () {
  const text = input.value;

  if (text === "") {
    return;
  }

  const newMessage = document.createElement("div");
  newMessage.className = "message";
  newMessage.textContent = text;

  messages.appendChild(newMessage);

  input.value = "";
});

