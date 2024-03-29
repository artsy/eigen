import { ImageCarouselContext } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { useSpringValue } from "app/Scenes/Artwork/Components/ImageCarousel/useSpringValue"
import { useContext } from "react"

/**
 * Hooks into the lifecycle of the full screen carousel to fade components in/out
 * once the full screen carousel is able to display its content.
 * @param fade either "in" or "out"
 */
export const useSpringFade = (fade: "in" | "out") => {
  const { fullScreenState } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()
  const isFullScreenReady =
    fullScreenState.current === "animating entry transition" ||
    fullScreenState.current === "entered"
  const [from, to] = fade === "in" ? [0, 1] : [1, 0]
  return useSpringValue(isFullScreenReady ? to : from)
}
