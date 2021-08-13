import { useFormikContext } from "formik"
import { Input } from "lib/Components/Input/Input"
import { InputTitle } from "lib/Components/Input/InputTitle"
import { navigate } from "lib/navigation/navigate"
import { Box, Button, Flex, Pill, Spacer, Text, Touchable } from "palette"
import React from "react"
import { getNamePlaceholder } from "../helpers"
import { SavedSearchAlertFormValues, SavedSearchArtistProp } from "../SavedSearchAlertModel"

interface FormProps extends SavedSearchArtistProp {
  pills: string[]
  isUpdateForm: boolean
  savedSearchAlertId?: string
  onDeletePress?: () => void
}

export const Form: React.FC<FormProps> = (props) => {
  const { pills, artist, isUpdateForm, savedSearchAlertId, onDeletePress } = props
  const {
    isSubmitting,
    values,
    errors,
    dirty,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormikContext<SavedSearchAlertFormValues>()
  const namePlaceholder = getNamePlaceholder(artist.name, pills)

  return (
    <Box>
      <Box mb={2}>
        <Input
          title="Name"
          placeholder={namePlaceholder}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
          testID="alert-input-name"
          maxLength={75}
        />
      </Box>
      {!!savedSearchAlertId && (
        <Box mb={2} height={40} justifyContent="center" alignItems="center">
          <Touchable
            haptic
            testID="view-artworks-button"
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
            onPress={() =>
              navigate(`/artist/${artist.id}`, {
                passProps: {
                  searchCriteriaID: savedSearchAlertId,
                },
              })
            }
          >
            <Text variant="small" color="blue100" style={{ textDecorationLine: "underline" }}>
              View Artworks
            </Text>
          </Touchable>
        </Box>
      )}
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
      <Button
        testID="save-alert-button"
        disabled={isUpdateForm && !dirty}
        loading={isSubmitting}
        size="large"
        block
        onPress={handleSubmit}
      >
        Save Alert
      </Button>
      {!!isUpdateForm && (
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
