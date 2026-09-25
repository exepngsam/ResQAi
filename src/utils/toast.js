// Simple event-based toast manager
let listeners = [];

export const toast = {
  notify(message, type = "info", title = "") {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const item = { id, message, type, title, timestamp: new Date().toLocaleTimeString() };
    listeners.forEach((fn) => fn(item));
    return id;
  },
  success(message, title = "ACTION CONFIRMED") {
    return this.notify(message, "success", title);
  },
  error(message, title = "CRITICAL ALERT") {
    return this.notify(message, "error", title);
  },
  warning(message, title = "TACTICAL WARNING") {
    return this.notify(message, "warning", title);
  },
  info(message, title = "SYSTEM NOTICE") {
    return this.notify(message, "info", title);
  },
  subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }
};
