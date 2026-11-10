import { useNavigation } from "@react-navigation/native"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"
import { SellConditionStore } from "app/Scenes/Sell/State/SellConditionStore"
import { useEffect } from "react"
import { Alert } from "react-native"

/** Asks before going back to step 1, since leaving step 2 clears its answers */
export const useConfirmLeavingConditionStep = () => {
  const navigation = useNavigation<SellNavigationProp>()
  const hasAnswers = SellConditionStore.useStoreState((state) => state.hasAnswers)

  useEffect(() => {
    // Fires for the header back button, the iOS swipe and the Android back button
    return navigation.addListener("beforeRemove", (event) => {
      if (!hasAnswers) {
        return
      }

      event.preventDefault()
      Alert.alert("Go back to step 1?", "The answers you gave on this step will be cleared.", [
        { text: "Stay", style: "cancel" },
        {
          text: "Go back",
          style: "destructive",
          onPress: () => navigation.dispatch(event.data.action),
        },
      ])
    })
  }, [navigation, hasAnswers])
}
