import { track as _track } from "lib/utils/track"
import { Join, Sans, Separator, Spacer } from "palette"
import { CollapsibleMenuItem } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItem"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { ArtworkDetailsContent } from "./ArtworkDetails"

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
        <CollapsibleMenuItem
          title="Artwork Details"
          activeStep={activeStep}
          step={1}
          setActiveStep={setActiveStep}
          Content={() => <ArtworkDetailsContent />}
          totalSteps={totalSteps}
        />
        <CollapsibleMenuItem
          title="Upload Photos"
          activeStep={activeStep}
          step={2}
          setActiveStep={setActiveStep}
          Content={() => (
            <Sans size="1" mt="1">
              Upload Photos Content
            </Sans>
          )}
          totalSteps={totalSteps}
        />
        <CollapsibleMenuItem
          title="Contact Information"
          activeStep={activeStep}
          step={3}
          setActiveStep={setActiveStep}
          Content={() => (
            <Sans size="1" mt="1">
              Contact Information Content
            </Sans>
          )}
          totalSteps={totalSteps}
          navigateToLink="artwork-submitted"
        />
      </Join>
    </ScrollView>
  )
}
