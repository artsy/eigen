import { useEffect, useState } from "react"

/** Returns true forever once `state` has been true  */
export const useHasBeenTrue = (state: boolean) => {
  const [hasBeenTrue, setHasBeenTrue] = useState(state)

  useEffect(() => {
    if (state) {
      setHasBeenTrue(true)
    }
  }, [state])

  return hasBeenTrue
}
