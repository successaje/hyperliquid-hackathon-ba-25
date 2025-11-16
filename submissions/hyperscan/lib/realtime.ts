type Handlers = {
  onBlock?: (block: any) => void;
  onTx?: (tx: any) => void;
  onPendingTx?: (tx: any) => void;
  onError?: (err: any) => void;
};

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private url: string | null;
  private handlers: Handlers;
  private reconnectTimer: any = null;

  constructor(handlers: Handlers, url = process.env.NEXT_PUBLIC_LAVA_WS_URL || "") {
    this.handlers = handlers;
    this.url = url || null;
  }

  start() {
    if (!this.url || typeof window === "undefined") return;
    if (this.ws) return;
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        // Subscribe to channels if protocol requires
        try {
          this.ws?.send(JSON.stringify({ action: "subscribe", channels: ["blocks", "txs", "pending"] }));
        } catch {}
      };
      this.ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          const type = msg?.type ?? msg?.channel;
          if (type === "block" || type === "blocks") this.handlers.onBlock?.(msg.data ?? msg.block ?? msg);
          else if (type === "tx" || type === "transactions") this.handlers.onTx?.(msg.data ?? msg.tx ?? msg);
          else if (type === "pending") this.handlers.onPendingTx?.(msg.data ?? msg.tx ?? msg);
        } catch (e) {
          this.handlers.onError?.(e);
        }
      };
      this.ws.onerror = (e) => this.handlers.onError?.(e);
      this.ws.onclose = () => {
        this.ws = null;
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => this.start(), 3000);
      };
    } catch (e) {
      this.handlers.onError?.(e);
    }
  }

  stop() {
    clearTimeout(this.reconnectTimer);
    if (this.ws) {
      try { this.ws.close(); } catch {}
      this.ws = null;
    }
  }
}


