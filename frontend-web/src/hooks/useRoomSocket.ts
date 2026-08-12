import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";

export function useRoomSocket() {
  const { roomId, setScreen, setScores, setTeamVerdict } = useGameStore()
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!roomId) return

    // Connect to Django Channels WebSocket URL
    const base = (import.meta.env.VITE_WS_URL as string) || 'ws://localhost:8000' 

    const wsUrl = `${base}/ws/rooms/${roomId}/`
    const ws = new WebSocket(wsUrl)
    socketRef.current = ws

    ws.onopen = () => {
      console.log(`Connected to Room socket: ${roomId}`)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.event) {
          case 'phase_changed':
            // Automatically transitions the screen (e.g. wait -> reveal)
            setScreen(data.phase)
            break

          case 'scores_updated':
            // Syncs attempt results and score state in real time
            if (data.scores) {
              setScores(
                data.scores.score_scroller,
                data.scores.score_verifier,
                data.scores.is_correct
              )
            }
            break

          default:
            console.log('Unhandled WS event:', data)
        }
      } catch (err) {
        console.error('Error parsing WS message:', err)
      }
    }

    ws.onclose = () => {
      console.log('Room socket disconnected')
    }

    return () => {
      ws.close()
    }
  }, [roomId, setScreen, setScores, setTeamVerdict])

  // Call this function to emit custom events from client tab to partner's tab
  const sendEvent = (event: string, payload: Record<string, any>) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event, ...payload }))
    }
  }

  return { sendEvent }
}