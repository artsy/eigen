import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { AuthScreen } from "app/Scenes/Onboarding/Screens/Auth/components/AuthScreen"
import { useCountryCode } from "app/Scenes/Onboarding/Screens/Auth/hooks/useCountryCode"
import { ForgotPasswordStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/ForgotPasswordStep"
import { LoginOTPStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/LoginOTPStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/LoginPasswordStep"
import { LoginWelcomeStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/LoginWelcomeStep"
import { SignUpNameStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/SignUpNameStep"
import { SignUpPasswordStep } from "app/Scenes/Onboarding/Screens/Auth/scenes/SignUpPasswordStep"
import { useEffect } from "react"
import { ScrollView } from "react-native-gesture-handler"

export const AuthScenes: React.FC = () => {
  const setIsAutomaticallySubscribed = AuthContext.useStoreActions(
    (actions) => actions.setIsAutomaticallySubscribed
  )

  const { loading: loadingCountry, isAutomaticallySubscribed } = useCountryCode()

  useEffect(() => {
    if (!loadingCountry) {
      setIsAutomaticallySubscribed(isAutomaticallySubscribed)
    }
  }, [isAutomaticallySubscribed, loadingCountry, setIsAutomaticallySubscribed])

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        scrollEnabled={false}
        contentContainerStyle={{ minHeight: 200 }}
      >
        <AuthScreen name="LoginWelcomeStep">
          <LoginWelcomeStep />
        </AuthScreen>

        <AuthScreen name="LoginPasswordStep">
          <LoginPasswordStep />
        </AuthScreen>

        <AuthScreen name="LoginOTPStep">
          <LoginOTPStep />
        </AuthScreen>

        <AuthScreen name="ForgotPasswordStep">
          <ForgotPasswordStep />
        </AuthScreen>

        <AuthScreen name="SignUpNameStep">
          <SignUpNameStep />
        </AuthScreen>

        <AuthScreen name="SignUpPasswordStep">
          <SignUpPasswordStep />
        </AuthScreen>
      </ScrollView>
    </>
  )
}
