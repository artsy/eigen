import { useFormikContext } from "formik"
import { FilterArray } from 'lib/Components/ArtworkFilter/ArtworkFilterHelpers'
import { Input } from "lib/Components/Input/Input"
import { InputTitle } from "lib/Components/Input/InputTitle"
import { Box, Button, Flex, Pill } from "palette"
import React from "react"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "../SavedSearchAlertModel"

interface FormProps extends SavedSearchAlertFormPropsBase {
  filters: FilterArray
  pills: string[]
}

export const Form: React.FC<FormProps> = (props) => {
  const { pills, filters, artist } = props
  const {
    isSubmitting,
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormikContext<SavedSearchAlertFormValues>()
  const filtersCountLabel = filters.length === 0 ? 'filter' : 'filters'

  return (
    <Box>
      <Box mb={2}>
        <Input
          title="Name"
          placeholder={`${artist.name} • ${filters.length} ${filtersCountLabel}`}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
        />
      </Box>
      <Box mb={2}>
        <InputTitle>Filters</InputTitle>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
          {pills.map((pill, index) => (
            <Pill m={0.5} key={`filter-label-${index}`}>
              {pill}
            </Pill>
          ))}
        </Flex>
      </Box>

      <Box mt={4}>
        <Button loading={isSubmitting} size="large" block onPress={handleSubmit}>
          Save Alert
        </Button>
      </Box>
    </Box>
  )
}
