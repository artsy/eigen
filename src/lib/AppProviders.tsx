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
    authorizationKey:
      "add the key for eigen-test-key from https://app.split.io/org/37f2ce10-9e25-11eb-8abb-128f4a94c92f/ws/37f87360-9e25-11eb-8abb-128f4a94c92f/admin/apis",
    key: "test",
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
