import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Theme } from "palette"
import React, { ReactNode } from "react"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { track } from "./utils/track"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

export const AppProviders = track()(({ children }: { children: ReactNode }) => (
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <ProvideScreenDimensions>
      <Theme>
        <ActionSheetProvider>
          <GlobalStoreProvider>
            <ToastProvider>
              <_FancyModalPageWrapper>{children}</_FancyModalPageWrapper>
            </ToastProvider>
          </GlobalStoreProvider>
        </ActionSheetProvider>
      </Theme>
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
))
