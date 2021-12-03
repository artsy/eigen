import { track as _track } from "lib/utils/track"
import { Spacer } from "palette"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { ArtworkDetails } from "./ArtworkDetails"
import { ContactInformation } from "./ContactInformation"
import { UploadPhotos } from "./UploadPhotos"

export const SubmitArtworkOverview = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  useEffect(() => {
    // console.log("\n\n ----------------------------- \n\n ")
  }, [activeStep])

  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={{
        paddingVertical: 20,
        justifyContent: "center",
      }}
    >
      <Spacer mb={3} />
      <ArtworkDetails activeStep={activeStep} setActiveStep={setActiveStep} step={1} totalSteps={totalSteps} />
      <UploadPhotos activeStep={activeStep} setActiveStep={setActiveStep} step={2} totalSteps={totalSteps} />
      <ContactInformation activeStep={activeStep} setActiveStep={setActiveStep} step={3} totalSteps={totalSteps} />
    </ScrollView>
  )
}
