import { Flex } from "@artsy/palette-mobile"
import { AuthContext, AuthScreen as AuthScreenItem } from "app/Scenes/Onboarding/Auth2/AuthContext"

interface AuthScreenProps {
  name: AuthScreenItem["name"]
}

export const AuthScreen: React.FC<React.PropsWithChildren<AuthScreenProps>> = ({
  children,
  name,
}) => {
  const { currentScreen } = AuthContext.useStoreState((state) => state)
  const isVisible = name === currentScreen?.name

  if (!isVisible) return null

  return (
    <>
      <Flex display="flex" zIndex={1} testID="auth-screen">
        {children}
      </Flex>
    </>
  )
}
