import { TimeOffsetProvider } from "app/Components/Bidding/Context/TimeOffsetProvider"
import { RegistrationQueryRenderer } from "app/Components/Bidding/Screens/Registration"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { View } from "react-native"
import { useScreenDimensions } from "shared/hooks"

export const RegistrationFlow: React.FC<{ saleID: string }> = (props) => {
  return (
    <TimeOffsetProvider>
      <View style={{ flex: 1, paddingTop: useScreenDimensions().safeAreaInsets.top }}>
        <NavigatorIOS
          initialRoute={{
            component: RegistrationQueryRenderer,
            passProps: props,
          }}
        />
      </View>
    </TimeOffsetProvider>
  )
}
