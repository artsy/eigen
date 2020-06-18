import { Box } from "@artsy/palette"
import { ConsignmentSubmissionCategoryAggregation } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { useArtworkForm } from "lib/Scenes/Consignments/v2/Form/useArtworkForm"
import { Input } from "lib/Scenes/Search/Input"
import React, { useRef, useState } from "react"
import { Picker } from "react-native"

export const MediumPicker: React.FC = () => {
  const { formik } = useArtworkForm()
  const [showPicker, setShowPicker] = useState(false)
  const mediumInputRef = useRef<Input>(null)
  const medium = mediumOptions.find(mediumOption => mediumOption.value === formik.values.medium)

  const handleValueChange = (value: ConsignmentSubmissionCategoryAggregation) => {
    formik.handleChange("medium")(value)
    setShowPicker(false)
    mediumInputRef.current?.blur()
  }

  return (
    <Box>
      <Input
        title="Medium"
        placeholder="Select"
        blurOnSubmit={true}
        value={medium?.name}
        ref={mediumInputRef}
        onTouchEnd={() => setShowPicker(true)}
      />

      {showPicker ? (
        <Picker
          style={{ height: 120, backgroundColor: "white" }}
          key="picker"
          selectedValue={formik.values.medium}
          onValueChange={handleValueChange}
        >
          {mediumOptions.map(({ name, value }, index) => (
            <Picker.Item color="black" label={name} value={value} key={index} />
          ))}
        </Picker>
      ) : null}
    </Box>
  )
}

interface Medium {
  name: string
  value: ConsignmentSubmissionCategoryAggregation
}

const mediumOptions: Medium[] = [
  { name: "Painting", value: "PAINTING" },
  { name: "Sculpture", value: "SCULPTURE" },
  { name: "Photography", value: "PHOTOGRAPHY" },
  { name: "Print", value: "PRINT" },
  { name: "Drawing, Collage or other Work on Paper", value: "DRAWING_COLLAGE_OR_OTHER_WORK_ON_PAPER" },
  { name: "Mixed Media", value: "MIXED_MEDIA" },
  { name: "Performance Art", value: "PERFORMANCE_ART" },
  { name: "Installation", value: "INSTALLATION" },
  { name: "Video/Film/Animation", value: "VIDEO_FILM_ANIMATION" },
  { name: "Architecture", value: "ARCHITECTURE" },
  { name: "Fashion Design and Wearable Art", value: "FASHION_DESIGN_AND_WEARABLE_ART" },
  { name: "Jewelry", value: "JEWELRY" },
  { name: "Design/Decorative Art", value: "DESIGN_DECORATIVE_ART" },
  { name: "Textile Arts", value: "TEXTILE_ARTS" },
  { name: "Other", value: "OTHER" },
]
