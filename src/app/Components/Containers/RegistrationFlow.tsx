import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { RegistrationQueryRenderer } from "app/Components/Bidding/Screens/Registration"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"

export const RegistrationFlow: React.FC<{ saleID: string }> = (props) => {
  return (
    <TimeOffsetProvider>
      <NavigatorIOS
        initialRoute={{
          component: RegistrationQueryRenderer,
          passProps: props,
        }}
      />
    </TimeOffsetProvider>
  )
}
