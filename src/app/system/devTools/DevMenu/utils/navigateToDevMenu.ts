import { internal_navigationRef } from "app/Navigation/Navigation"

export const navigateToDevMenu = () => {
  internal_navigationRef.current?.navigate("DevMenu")
}
