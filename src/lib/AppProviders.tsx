import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { SplitFactory } from "@splitsoftware/splitio-react"
import { Theme } from "palette"
import React, { ReactNode } from "react"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStoreProvider } from "./store/GlobalStore"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

const splitConfig = {
  core: {
    authorizationKey: "",
    key: "",
  },
}

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <ProvideScreenDimensions>
      <SplitFactory config={splitConfig}>
        <Theme>
          <ActionSheetProvider>
            <GlobalStoreProvider>
              <ToastProvider>
                <_FancyModalPageWrapper>{children}</_FancyModalPageWrapper>
              </ToastProvider>
            </GlobalStoreProvider>
          </ActionSheetProvider>
        </Theme>
      </SplitFactory>
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
)
