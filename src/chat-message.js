



class ChatMessage extends HTMLElement {

  connectedCallback() {

    const role = this.getAttribute("role");

    const isUser = role === "user";

    this.innerHTML = `
      <div class="flex ${isUser ? "justify-end" : "justify-start"}">
        <div class="px-4 py-2 rounded-lg max-w-xs ${isUser ? "bg-blue-500 text-white" : "bg-gray-200"}">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }

}

customElements.define("chat-message", ChatMessage);