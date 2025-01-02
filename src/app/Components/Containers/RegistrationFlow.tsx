import { Screen } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Token } from "@stripe/stripe-react-native"
import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { CreditCardForm } from "app/Components/Bidding/Screens/CreditCardForm"
import { PhoneNumberForm } from "app/Components/Bidding/Screens/PhoneNumberForm"
import { RegistrationQueryRenderer } from "app/Components/Bidding/Screens/Registration"
import {
  RegistrationResult,
  RegistrationStatus,
} from "app/Components/Bidding/Screens/RegistrationResult"
import { Address } from "app/Components/Bidding/types"

export type RegistrationFlowNavigationStackParams = {
  RegisterToBid: { saleID: string }
  RegistrationResult: {
    needsIdentityVerification: boolean
    status: RegistrationStatus
  }
  PhoneNumberForm: {
    onSubmit: (phoneNumber: string) => void
    phoneNumber: string | undefined
  }
  CreditCardForm: {
    onSubmit: (t: Token.Result, a: Address) => void
    billingAddress?: Address | null
  }
}

export const RegistrationFlowNavigationStack =
  createNativeStackNavigator<RegistrationFlowNavigationStackParams>()

export const RegistrationFlow: React.FC<{ saleID: string }> = (props) => {
  return (
    <Screen>
      <TimeOffsetProvider>
        <NavigationContainer independent>
          <RegistrationFlowNavigationStack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              contentStyle: {
                flex: 1,
                backgroundColor: "white",
              },
            }}
          >
            <RegistrationFlowNavigationStack.Screen
              name="RegisterToBid"
              component={RegistrationQueryRenderer}
              initialParams={props}
            />
            <RegistrationFlowNavigationStack.Screen
              name="RegistrationResult"
              component={RegistrationResult}
            />
            <RegistrationFlowNavigationStack.Screen
              name="PhoneNumberForm"
              component={PhoneNumberForm}
            />
            <RegistrationFlowNavigationStack.Screen
              name="CreditCardForm"
              component={CreditCardForm}
            />
          </RegistrationFlowNavigationStack.Navigator>
        </NavigationContainer>
      </TimeOffsetProvider>
    </Screen>
  )
}
