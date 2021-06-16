import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Theme } from "palette"
import React, { ReactNode } from "react"
import codePush from "react-native-code-push"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <ProvideScreenDimensions>
      <Theme>
        <ActionSheetProvider>
          <GlobalStoreProvider>
            <ToastProvider>
              <PopoverMessageProvider>
                <_FancyModalPageWrapper>
                  {children}
                </_FancyModalPageWrapper>
              </PopoverMessageProvider>
            </ToastProvider>
          </GlobalStoreProvider>
        </ActionSheetProvider>
      </Theme>
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
)

export const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START }
