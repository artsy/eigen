import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Theme } from "palette"
import React, { ReactNode } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

export const AppProviders = ({ children }: { children: ReactNode }) => (
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
