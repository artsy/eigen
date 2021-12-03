import { track as _track } from "lib/utils/track"
import React from "react"
import { ScrollView, Text, View } from "react-native"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"
interface Props {
  setStep1Completed: any
}

const ArtworkDetailsContent = () => {
  return (
    <View>
      <Text>This is the ArtworkDetailsContent content...</Text>
    </View>
  )
}
export const ArtworkDetails: React.FC<Props> = (
  {
    // setStep1Completed
  }
) => {
  // const checkIfFormIsCompleted = () => {
  //   // Check conditions
  //   // setIsFormComplete()
  // }

  return (
    <ScrollView>
      <CollapsibleMenuItem
        title="Artwork Details"
        content={<ArtworkDetailsContent />}
        step={1}
        totalSteps={3}
        // isCompleted={step1Completed}
      />
    </ScrollView>
  )
}
