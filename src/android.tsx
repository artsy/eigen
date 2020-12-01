import { NavigationContainer } from "@react-navigation/native"
import { LogIn } from "lib/LogIn/LogIn"
import "lib/store/GlobalStore"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"
import { AppRegistry } from "react-native"

const AndroidRoot: React.FC<{}> = ({}) => {
  return (
    <Theme>
      <GlobalStoreProvider>
        <NavigationContainer>
          <LogIn />
        </NavigationContainer>
      </GlobalStoreProvider>
    </Theme>
  )
}

AppRegistry.registerComponent("Artsy", () => AndroidRoot)
