import { useEffect, useRef, useState } from "react"

export type FlightPhase = "pop_in" | "flight" | "fade_out"

interface UseSaveFlightPhaseOptions {
  popInDuration: number
  flightDuration: number
  fadeOutDuration: number
  onComplete: () => void
}

export const useSaveFlightPhase = ({
  popInDuration,
  flightDuration,
  fadeOutDuration,
  onComplete,
}: UseSaveFlightPhaseOptions) => {
  const [phase, setPhase] = useState<FlightPhase>("pop_in")
  const onCompleteRef = useRef(onComplete)
  // lets the timer below call the freshest onComplete, without restarting the timer to get it
  onCompleteRef.current = onComplete

  // advances pop_in -> flight -> fade_out, then calls onComplete once fade_out finishes
  useEffect(() => {
    const duration =
      phase === "pop_in" ? popInDuration : phase === "flight" ? flightDuration : fadeOutDuration

    const timeout = setTimeout(() => {
      if (phase === "pop_in") setPhase("flight")
      else if (phase === "flight") setPhase("fade_out")
      else onCompleteRef.current()
    }, duration)

    return () => clearTimeout(timeout)
  }, [phase, popInDuration, flightDuration, fadeOutDuration])

  return phase
}
