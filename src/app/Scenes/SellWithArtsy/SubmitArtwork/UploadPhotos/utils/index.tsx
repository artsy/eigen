import { StackScreenProps } from "@react-navigation/stack"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { SellWithArtsyHomeQueryRenderer } from "app/Scenes/SellWithArtsy/SellWithArtsyHome"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, switchTab } from "app/system/navigation/navigate"
import { useCallback, useEffect, useRef } from "react"
import { BackHandler } from "react-native"

export interface SellTabProps {
  overwriteHardwareBackButtonPath?: BottomTabType
}

type SellWithArtsyProps = StackScreenProps<any>

export const SellWithArtsy: React.FC<SellWithArtsyProps> = () => {
  const sellTabProps = GlobalStore.useAppState((state) => {
    return state.bottomTabs.sessionState.tabProps.sell ?? {}
  }) as SellTabProps

  const overwriteHardwareBackButtonPath = sellTabProps?.overwriteHardwareBackButtonPath ?? null

  const sellTabPropsRef = useRef<BottomTabType | null>(null)

  useEffect(() => {
    sellTabPropsRef.current = overwriteHardwareBackButtonPath
  }, [overwriteHardwareBackButtonPath])

  useEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton)

      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton)
    }, [])
  )

  const handleBackButton = useCallback(() => {
    if (sellTabPropsRef.current) {
      switchTab(sellTabPropsRef.current)
      GlobalStore.actions.bottomTabs.setTabProps({ tab: "sell", props: {} })
    } else {
      goBack()
    }

    return true
  }, [sellTabPropsRef.current])

  return <SellWithArtsyHomeQueryRenderer />
}
