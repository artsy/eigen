import { track as _track } from "lib/utils/track"
import { Sans, Spacer } from "palette"
import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import { ArtworkDetails } from "./ArtworkDetails"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export const UploadPhotos = () => {
  return (
    <View>
      <CollapsibleMenuItem
        title="UploadPhotos"
        content="UploadPhotos content"
        step={1}
        totalSteps={3}
        // isCompleted={step1Completed}
      />
      <Sans size="1" mx="2" mt="1">
        UploadPhotos
      </Sans>
    </View>
  )
}
export const ContactInformation = () => {
  return (
    <View>
      <CollapsibleMenuItem
        title="Contact information"
        content="Contact information content"
        step={1}
        totalSteps={3}
        // isCompleted={step1Completed}
      />
    </View>
  )
}
export const SubmitArtworkOverview = () => {
  const [
    ,
    // step1Completed
    setStep1Completed,
  ] = useState(false)
  // const [step2Completed, setStep2Completed] = useState(false)
  // const [step3Completed, setStep3Completed] = useState(false)

  // const content2 = (
  //   <StepContent
  //     title="Artwork Details"
  //     content="We will only use these details to contact you regarding your submission"
  //     setStepCompleted={setStep2Completed}
  //   />
  // )
  // const content3 = (
  //   <StepContent
  //     title="Artwork Details"
  //     content="We will only use these details to contact you regarding your submission"
  //     setStepCompleted={setStep3Completed}
  //   />
  // )

  return (
    <ScrollView
      style={{ flex: 1 }}
      alwaysBounceVertical={false}
      contentContainerStyle={{ paddingVertical: 20, justifyContent: "center" }}
    >
      <Spacer mb={3} />
      <ArtworkDetails setStep1Completed={setStep1Completed} />
      <UploadPhotos />
      <ContactInformation />
      {/* <CollapsibleMenuItem
        title="Artwork Details"
        content={<ArtworkDetails setStep1Completed={setStep1Completed} />}
        step={1}
        totalSteps={3}
        isCompleted={step1Completed}
      />
      <CollapsibleMenuItem title="Title 2" content={content2} step={2} totalSteps={3} isCompleted={step2Completed} />
      <CollapsibleMenuItem title="Title 3" content={content3} step={3} totalSteps={3} isCompleted={step3Completed} /> */}
    </ScrollView>
  )
}
