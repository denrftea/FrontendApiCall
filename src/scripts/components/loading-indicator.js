class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
    </style>
      <div class="loading-indicator">
        <div class="loading-spinner"></div>
        <span>Loading...</span>
      </div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);