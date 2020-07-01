import { StoreProvider } from "easy-peasy"
import React, { useEffect, useRef } from "react"
import { View } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { useStoreActions } from "./State/hooks"
import { store } from "./State/store"

interface BootProps {
  children: React.ReactNode
}

export const Boot: React.FC<BootProps> = ({ children }) => {
  return <StoreProvider store={store}>{children}</StoreProvider>
}

export const setupMyCollectionScreen = (Component: React.ComponentType<any>) => {
  const NavigatorIOSWrapper: React.FC<{
    navigator: NavigatorIOS
  }> = props => {
    const navViewRef = useRef<View>(null)
    const { setupNavigation } = useStoreActions(actions => actions.navigation)

    /**
     * Whenever a new view controller is mounted we refresh our navigation
     */
    useEffect(() => {
      setupNavigation({
        navigator: props.navigator,
        navViewRef,
      })
    }, [])

    return (
      <View ref={navViewRef}>
        <Component {...props} />
      </View>
    )
  }

  return (props: any) => {
    return (
      <Boot>
        <NavigatorIOS
          style={{ flex: 1 }}
          navigationBarHidden={true}
          initialRoute={{
            component: NavigatorIOSWrapper,
            passProps: props,
          }}
        />
      </Boot>
    )
  }
}
