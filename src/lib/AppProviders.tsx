import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Theme } from "palette"
import React, { ReactNode } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStoreProvider, unsafe_getFeatureFlag } from "./store/GlobalStore"
import { ExperimentsInitialiser } from "./utils/useExperiments"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const enableSplitIOABTesting = unsafe_getFeatureFlag("AREnableSplitIOABTesting")

  return (
    <SafeAreaProvider>
      <ProvideScreenDimensions>
        <GlobalStoreProvider>
          <RelayEnvironmentProvider environment={defaultEnvironment}>
            <Theme>
              <ActionSheetProvider>
                <PopoverMessageProvider>
                  <_FancyModalPageWrapper>
                    <ToastProvider>
                      {/*  */}
                      {children}
                      {/*  */}
                      {!!enableSplitIOABTesting && <ExperimentsInitialiser />}
                    </ToastProvider>
                  </_FancyModalPageWrapper>
                </PopoverMessageProvider>
              </ActionSheetProvider>
            </Theme>
          </RelayEnvironmentProvider>
        </GlobalStoreProvider>
      </ProvideScreenDimensions>
    </SafeAreaProvider>
  )
}
