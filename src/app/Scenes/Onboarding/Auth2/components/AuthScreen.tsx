import { Flex } from "@artsy/palette-mobile"
import { AuthContext, AuthScreen as AuthScreenItem } from "app/Scenes/Onboarding/Auth2/AuthContext"

interface AuthScreenProps {
  name: AuthScreenItem["name"]
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ children, name }) => {
  const { currentScreen } = AuthContext.useStoreState((state) => state)
  const isVisible = name === currentScreen?.name

  return (
    <>
      <Flex display={isVisible ? "flex" : "none"} zIndex={isVisible ? 1 : 0} testID="auth-screen">
        {children}
      </Flex>
    </>
  )
}
