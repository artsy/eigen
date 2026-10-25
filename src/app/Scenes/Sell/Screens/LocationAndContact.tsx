import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellSubmittedBottomSheet } from "app/Scenes/Sell/Components/SellSubmittedBottomSheet"
import { useState } from "react"
import { ScrollView } from "react-native"

export const LocationAndContact: React.FC = () => {
  const [showSubmittedConfirmation, setShowSubmittedConfirmation] = useState(false)

  return (
    <>
      <SellStepLayout
        buttonLabel="Submit for Review"
        onButtonPress={() => setShowSubmittedConfirmation(true)}
      >
        <ScrollView>
          <SellStepIntro stepName="LocationAndContact" px={2} />
        </ScrollView>
      </SellStepLayout>

      {!!showSubmittedConfirmation && (
        <SellSubmittedBottomSheet
          visible={showSubmittedConfirmation}
          onDismiss={() => setShowSubmittedConfirmation(false)}
        />
      )}
    </>
  )
}
