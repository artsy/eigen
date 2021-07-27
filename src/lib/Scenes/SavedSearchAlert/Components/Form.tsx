import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { InputTitle } from "lib/Components/Input/InputTitle"
import { Box, Button, Flex, Pill } from "palette"
import React from "react"
import { SavedSearchAlertFormValues } from "../SavedSearchAlertModel"

const filterLabels = ["Unique", "Limited Edition", "Painting", "$10,000-$50,000"]

export const Form: React.FC<{}> = () => {
  const {
    isSubmitting,
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormikContext<SavedSearchAlertFormValues>()

  return (
    <Box>
      <Box mb={2}>
        <Input
          title="Name"
          placeholder="Amoako Boafo • 4 Filters"
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
        />
      </Box>
      <Box mb={2}>
        <InputTitle>Filters</InputTitle>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
          {filterLabels.map((label, index) => (
            <Pill m={0.5} key={`filter-label-${index}`}>
              {label}
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

