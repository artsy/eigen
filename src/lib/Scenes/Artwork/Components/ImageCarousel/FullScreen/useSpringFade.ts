import { useComputed } from "mobx-react-lite"
import { useContext } from "react"
import { ImageCarouselContext } from "../ImageCarouselContext"
import { useSpringValue } from "../useSpringValue"

/**
 * Hooks into the lifecycle of the fulls creen carousel to fade components in/out
 * once the full screen carousel is able to display its content.
 * @param fade either "in" or "out"
 */
export const useSpringFade = (fade: "in" | "out") => {
  const { state } = useContext(ImageCarouselContext)
  const isFullScreenReady = useComputed(
    () => state.fullScreenState === "animating entry transition" || state.fullScreenState === "entered"
  )
  const [from, to] = fade === "in" ? [0, 1] : [1, 0]
  return useSpringValue(isFullScreenReady ? to : from)
}
