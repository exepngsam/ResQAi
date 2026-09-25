class WebSocketClient {
  ws = null;
  url;
  listeners = [];
  reconnectInterval = 3e3;
  shouldReconnect = true;
  isConnected = false;
  constructor(endpoint) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = "localhost:8000";
    this.url = `${protocol}//${host}${endpoint}`;
  }
  connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.isConnected = true;
      };
      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.listeners.forEach((cb) => cb(parsed));
        } catch (e) {
          console.warn("Failed to parse WS payload:", e);
        }
      };
      this.ws.onclose = () => {
        this.isConnected = false;
        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), this.reconnectInterval);
        }
      };
      this.ws.onerror = () => {
        if (this.ws) this.ws.close();
      };
    } catch (e) {
      this.isConnected = false;
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    }
  }
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }
  disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
    }
  }
}
const dashboardSocket = new WebSocketClient("/ws/dashboard");
const simulationSocket = new WebSocketClient("/ws/simulation");
export {
  dashboardSocket,
  simulationSocket
};
