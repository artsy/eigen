import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellSubmittedBottomSheet } from "app/Scenes/Sell/Components/SellSubmittedBottomSheet"
import { useState } from "react"

export const LocationAndContact: React.FC = () => {
  const [showSubmittedConfirmation, setShowSubmittedConfirmation] = useState(false)

  return (
    <>
      <SellStepLayout
        buttonLabel="Submit for Review"
        onButtonPress={() => setShowSubmittedConfirmation(true)}
      />

      {!!showSubmittedConfirmation && (
        <SellSubmittedBottomSheet
          visible={showSubmittedConfirmation}
          onDismiss={() => setShowSubmittedConfirmation(false)}
        />
      )}
    </>
  )
}
