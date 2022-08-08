import { ConsignmentSubmissionCategoryAggregation } from "__generated__/createConsignSubmissionMutation.graphql"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { Select } from "palette/elements/Select"

export const CategoryPicker: React.FC = () => {
  const { formik } = useArtworkForm()

  const handleValueChange = (value: ConsignmentSubmissionCategoryAggregation) => {
    formik.handleChange("category")(value)
  }

  return (
    <Select
      onSelectValue={handleValueChange}
      value={formik.values.category}
      enableSearch={false}
      title="Medium"
      placeholder="Select"
      testID="CategorySelect"
      required
      options={artworkMediumCategories}
    />
  )
}
