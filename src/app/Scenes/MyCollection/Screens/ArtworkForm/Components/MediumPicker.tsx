import { ConsignmentSubmissionCategoryAggregation } from "__generated__/createConsignSubmissionMutation.graphql"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { Select } from "palette/elements/Select"
import React from "react"

export const MediumPicker: React.FC = () => {
  const { formik } = useArtworkForm()

  const handleValueChange = (value: ConsignmentSubmissionCategoryAggregation) => {
    formik.handleChange("medium")(value)
  }

  return (
    <Select
      onSelectValue={handleValueChange}
      value={formik.values.medium}
      enableSearch={false}
      title="Medium"
      placeholder="Select"
      testID="MediumSelect"
      required
      options={artworkMediumCategories}
    />
  )
}
