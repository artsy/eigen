import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { InputTitle } from "lib/Components/Input/InputTitle"
import { Box, Button, Flex, Pill, Spacer } from "palette"
import React from "react"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "../SavedSearchAlertModel"

interface FormProps extends SavedSearchAlertFormPropsBase {
  pills: string[]
  onDeletePress?: () => void
}

export const Form: React.FC<FormProps> = (props) => {
  const { pills, artist, onDeletePress } = props
  const {
    isSubmitting,
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormikContext<SavedSearchAlertFormValues>()
  const filtersCountLabel = pills.length > 1 ? "filters" : "filter"

  return (
    <Box>
      <Box mb={2}>
        <Input
          title="Name"
          placeholder={`${artist.name} • ${pills.length} ${filtersCountLabel}`}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
          testID="alert-input-name"
        />
      </Box>
      <Box mb={2}>
        <InputTitle>Filters</InputTitle>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
          {pills.map((pill, index) => (
            <Pill testID="alert-pill" m={0.5} key={`filter-label-${index}`}>
              {pill}
            </Pill>
          ))}
        </Flex>
      </Box>
      <Spacer mt={4} />
      <Button testID="save-alert-button" loading={isSubmitting} size="large" block onPress={handleSubmit}>
        Save Alert
      </Button>
      {!!onDeletePress && (
        <Button
          testID="delete-alert-button"
          variant="secondaryOutline"
          mt={2}
          size="large"
          block
          onPress={onDeletePress}
        >
          Delete Alert
        </Button>
      )}
    </Box>
  )
}
