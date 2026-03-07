import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(rooms: string[]) {
  const wsRef = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (rooms.length === 0) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      setConnected(true);
      rooms.forEach(room => {
        ws.send(JSON.stringify({ type: "join", room }));
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(() => connect(), 3000);
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, [rooms.join(",")]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return { lastMessage, connected };
}
