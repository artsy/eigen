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
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <SafeAreaProvider>
      <ProvideScreenDimensions>
        <GlobalStoreProvider>
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
        </GlobalStoreProvider>
      </ProvideScreenDimensions>
    </SafeAreaProvider>
  </RelayEnvironmentProvider>
)
