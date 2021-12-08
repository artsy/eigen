import { track as _track } from "lib/utils/track"
import { Join, Separator, Spacer } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { ArtworkDetails } from "./ArtworkDetails"
import { ContactInformation } from "./ContactInformation"
import { UploadPhotos } from "./UploadPhotos"

export const SubmitArtworkOverview = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={{
        paddingVertical: 20,
        justifyContent: "center",
      }}
    >
      <Spacer mb={3} />
      <Join separator={<Separator my={2} marginTop="40" marginBottom="20" />}>
        <ArtworkDetails
          title="Artwork Details"
          activeStep={activeStep}
          step={1}
          totalSteps={totalSteps}
          setActiveStep={setActiveStep}
        />
        <UploadPhotos
          title="Artwork Details"
          activeStep={activeStep}
          step={2}
          totalSteps={totalSteps}
          setActiveStep={setActiveStep}
        />
        <ContactInformation
          title="Contact Information"
          activeStep={activeStep}
          step={3}
          totalSteps={totalSteps}
          setActiveStep={setActiveStep}
        />
      </Join>
    </ScrollView>
  )
}
