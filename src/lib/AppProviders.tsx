import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Theme } from "palette"
import React, { ReactNode } from "react"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { NotificationProvider } from "./Components/Notification/NotificationProvider"
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
              <NotificationProvider>
                <_FancyModalPageWrapper>
                  {children}
                </_FancyModalPageWrapper>
              </NotificationProvider>
            </ToastProvider>
          </GlobalStoreProvider>
        </ActionSheetProvider>
      </Theme>
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
)
