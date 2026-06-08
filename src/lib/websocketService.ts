/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/websocketService.ts
// Client-side WebSocket with HARD protection against server spam

type WSHandler = (payload: any) => void;

class WSService {
  // private base = "ws://bo-chat.space:3000";
  // private base = typeof window !== 'undefined' && window.location.protocol === 'https:'
  // ? "wss://bo-chat.space:3000"
  // : "ws://bo-chat.space:3000";
  private base =
  typeof window !== "undefined" &&
  window.location.protocol === "https:"
    ? "wss://bochat-eg.com/ws"
    : "ws://bochat-eg.com/ws";
  private ws: WebSocket | null = null;
  private handlers = new Set<WSHandler>();

  /* ------------------ CONNECTION STATE ------------------ */
  private lastUserId: string | null = null;
  private shouldReconnect = true;
  private isConnecting = false;

  /* ------------------ RECONNECT ------------------ */
  private reconnectMs = 1000;
  private maxReconnectMs = 30000;

  /* ------------------ PING ------------------ */
  private pingIntervalId: number | null = null;

  /* ------------------ ACTIVITY CONTROL ------------------ */
  private lastActivityHash = "";
  private lastActivityHandledAt = 0;
  private ACTIVITY_THROTTLE_MS = 5000; // 🔥 مرة كل 5 ثواني فقط

  /* ------------------ DEBUG ------------------ */
  private debug = true;

  private log(...args: any[]) {
    if (!this.debug) return;
    console.log("%c[WS]", "color:#D72229;font-weight:bold;", ...args);
  }

   /* ------------------ CONNECT ------------------ */
  connect(userId: string) {
    if (!userId) return;

    // منع التكرار
    if (
      this.lastUserId === userId &&
      this.ws &&
      this.ws.readyState === WebSocket.OPEN
    ) {
      this.log("CONNECT skipped (already connected)");
      return;
    }

    if (this.isConnecting) {
      this.log("CONNECT skipped (connecting)");
      return;
    }

    this.isConnecting = true;
    this.shouldReconnect = true;
    this.lastUserId = userId;

    const url = `${this.base}/?userid=${encodeURIComponent(userId)}`;
    this.log("CONNECT()", url);

    this.open(url);
  }

  /* ------------------ OPEN ------------------ */
  private open(url: string) {
    try {
      if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
        try { this.ws.close(); } catch {}
      }

      this.ws = new WebSocket(url);

      this.ws.addEventListener("open", () => {
        this.log("SOCKET OPENED");
        this.isConnecting = false;
        this.reconnectMs = 1000;
        this.startPing();
      });

      this.ws.addEventListener("message", (ev) => {
        let parsed: any = ev.data;
        try {
          parsed = JSON.parse(ev.data);
        } catch {
          return;
        }

        this.handleMessage(parsed);
      });

      this.ws.addEventListener("close", (ev) => {
        this.log("SOCKET CLOSED", ev.code, ev.reason);
        this.isConnecting = false;
        this.stopPing();

        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      });

      this.ws.addEventListener("error", (err) => {
        this.log("SOCKET ERROR", err);
      });

    } catch (e) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  /* ------------------ MESSAGE HANDLER ------------------ */
  private handleMessage(parsed: any) {
    // ❌ تجاهل أخطاء السيرفر
    if (parsed?.status === "error") {
      this.log("SERVER ERROR ignored", parsed.message);
      return;
    }

    // 🔥 تحكم صارم في user-activity-update
    if (parsed?.event === "user-activity-update") {
      const now = Date.now();

      // 1️⃣ throttle
      if (now - this.lastActivityHandledAt < this.ACTIVITY_THROTTLE_MS) {
        this.log("ACTIVITY throttled");
        return;
      }

      // 2️⃣ normalize + dedupe
      const users = Array.isArray(parsed.activeUsers)
        ? [...parsed.activeUsers].sort()
        : [];

      const hash = JSON.stringify(users);

      if (hash === this.lastActivityHash) {
        this.log("ACTIVITY ignored (duplicate)");
        return;
      }

      this.lastActivityHash = hash;
      this.lastActivityHandledAt = now;

      this.log("ACTIVITY accepted", users);
    }

    // ✅ مرّر الحدث لباقي التطبيق
    this.handlers.forEach((handler) => {
      try {
        handler(parsed);
      } catch (e) {
        this.log("HANDLER ERROR", e);
      }
    });
  }

  /* ------------------ RECONNECT ------------------ */
  private scheduleReconnect() {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) return;

    this.log("RECONNECT scheduled in", this.reconnectMs, "ms");

    setTimeout(() => {
      this.reconnectMs = Math.min(
        Math.floor(this.reconnectMs * 1.5),
        this.maxReconnectMs
      );

      if (!this.lastUserId) return;

      const url = `${this.base}/?userid=${encodeURIComponent(this.lastUserId)}`;
      this.log("RECONNECT now");

      this.open(url);
    }, this.reconnectMs);
  }

  /* ------------------ SEND ------------------ */
  send(payload: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const data =
      typeof payload === "string"
        ? payload
        : JSON.stringify(payload);

    this.ws.send(data);
  }

  /* ------------------ HANDLERS ------------------ */
  addHandler(fn: WSHandler) {
    this.handlers.add(fn);
    return () => {
      this.handlers.delete(fn);
    };
  }

  /* ------------------ DISCONNECT ------------------ */
  disconnect() {
    this.log("DISCONNECT");

    this.shouldReconnect = false;
    this.isConnecting = false;

    try { this.ws?.close(); } catch {}

    this.ws = null;
    this.handlers.clear();
    this.stopPing();
  }

  /* ------------------ PING ------------------ */
  private startPing() {
    this.stopPing();

    this.pingIntervalId = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  }

  private stopPing() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }

  get socket() {
    return this.ws;
  }
 }

const wsService = new WSService();
export default wsService;
