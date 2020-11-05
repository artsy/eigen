import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import React from "react"
import { MyCollectionAdditionalDetailsForm } from "./MyCollectionAdditionalDetailsForm"

import { MyCollectionArtworkForm } from "./MyCollectionArtworkForm"

export type ArtworkFormMode = "add" | "edit"

export const MyCollectionArtworkFormModal: React.FC<{
  mode: ArtworkFormMode
  visible: boolean
  onDismiss: () => void
}> = ({ mode, visible, onDismiss }) => {
  return (
    <NavigationContainer>
      <FancyModal visible={visible} onBackgroundPressed={() => onDismiss()}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 } }}
        >
          <Stack.Screen name="ArtworkForm" component={MyCollectionArtworkForm} initialParams={{ mode }} />
          <Stack.Screen name="ArtworkDetailsForm" component={MyCollectionAdditionalDetailsForm} />
        </Stack.Navigator>
      </FancyModal>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator()
