import { ConsignmentSubmissionCategoryAggregation } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/ArtworkFormModal/Form/useArtworkForm"
import { artworkMediumCategories } from "lib/utils/artworkMediumCategories"
import { Select, SelectComponentI } from "palette/elements/Select"
import React, { useRef } from "react"

export const MediumPicker: React.FC = () => {
  const { formik } = useArtworkForm()
  const mediumInputRef = useRef<SelectComponentI<ConsignmentSubmissionCategoryAggregation>>(null)

  const handleValueChange = (value: ConsignmentSubmissionCategoryAggregation) => {
    formik.handleChange("medium")(value)
  }

  return (
    <Select
      ref={mediumInputRef}
      onSelectValue={handleValueChange}
      value={formik.values.medium}
      enableSearch={false}
      title="Medium"
      placeholder="Select"
      options={artworkMediumCategories}
    />
  )
}
