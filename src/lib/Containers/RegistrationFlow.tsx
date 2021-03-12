import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { RegistrationQueryRenderer } from "../Components/Bidding/Screens/Registration"

export const RegistrationFlow: React.FC<{ saleID: string }> = (props) => {
  return (
    <TimeOffsetProvider>
      <View style={{ flex: 1, paddingTop: useSafeAreaInsets().top }}>
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
