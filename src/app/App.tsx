import { View } from "react-native"
import { FPSCounter } from "./Components/FPSCounter"

export const Main = () => {
  const fpsCounter = false
  const num = 6
  const nullable: boolean | null = true

  return (
    <View>
      {fpsCounter && <FPSCounter />}
      {!!fpsCounter && <FPSCounter />}
      {num && <FPSCounter />}
      {!!num && <FPSCounter />}
      {nullable && <FPSCounter />}
      {!!nullable && <FPSCounter />}
    </View>
  )
}
