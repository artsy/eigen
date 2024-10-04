import { Flex } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"

interface AuthScreenProps {
  name: string
  isVisible?: boolean
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ children, name }) => {
  const { currentScreen } = AuthContext.useStoreState((state) => state)
  const isVisible = name === currentScreen?.name

  return (
    <>
      <Flex display={isVisible ? "flex" : "none"}>{children}</Flex>
    </>
  )
}
