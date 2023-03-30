import { useAnimationState } from "moti"

export const useFadeInLeft = () => {
  return useAnimationState({
    from: {
      translateX: -10,
      opacity: 0,
    },
    to: {
      translateX: 0,
      opacity: 1,
    },
  })
}
