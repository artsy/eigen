import { useState } from "react"

export const useCounter = (initialValue = 0): [number, () => void] => {
  const [counter, setCounter] = useState(initialValue)
  const increment = () => setCounter((prevCounter) => prevCounter + 1)

  return [counter, increment]
}
