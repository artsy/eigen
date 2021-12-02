import { track as _track } from "lib/utils/track"
import { Spacer } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { ArtworkDetails } from "./ArtworkDetails"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"
import { StepContent } from "./StepContent"

export const SubmitArtworkOverview = () => {
  const [step1Completed, setStep1Completed] = useState(false)
  const [step2Completed, setStep2Completed] = useState(false)
  const [step3Completed, setStep3Completed] = useState(false)

  const content2 = (
    <StepContent
      title="Artwork Details"
      content="We will only use these details to contact you regarding your submission"
      setStepCompleted={setStep2Completed}
    />
  )
  const content3 = (
    <StepContent
      title="Artwork Details"
      content="We will only use these details to contact you regarding your submission"
      setStepCompleted={setStep3Completed}
    />
  )

  return (
    <ScrollView
      style={{ flex: 1 }}
      alwaysBounceVertical={false}
      contentContainerStyle={{ paddingVertical: 20, justifyContent: "center" }}
    >
      <Spacer mb={3} />
      <CollapsibleMenuItem
        title="Artwork Details"
        content={<ArtworkDetails setStep1Completed={setStep1Completed} />}
        step={1}
        totalSteps={3}
        isCompleted={step1Completed}
      />
      <CollapsibleMenuItem title="Title 2" content={content2} step={2} totalSteps={3} isCompleted={step2Completed} />
      <CollapsibleMenuItem title="Title 3" content={content3} step={3} totalSteps={3} isCompleted={step3Completed} />
    </ScrollView>
  )
}
