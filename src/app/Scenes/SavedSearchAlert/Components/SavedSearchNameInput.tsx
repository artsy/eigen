import { Input, Text } from "@artsy/palette-mobile"
import { SavedSearchNameInputQuery } from "__generated__/SavedSearchNameInputQuery.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchAlertFormValues } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useFormikContext } from "formik"
import { omit } from "lodash"
import { useEffect, useState } from "react"
import { Platform } from "react-native"
import { QueryRenderer, graphql } from "react-relay"
interface SavedSearchNameInputProps {
  placeholder?: string
}

export const SavedSearchNameInput: React.FC<SavedSearchNameInputProps> = ({ placeholder }) => {
  const { values, errors, handleBlur, handleChange } =
    useFormikContext<SavedSearchAlertFormValues>()

  const [placeholderState, setPlaceholderState] = useState(placeholder)

  useEffect(() => {
    if (placeholder) {
      setPlaceholderState(placeholder)
    }
  })

  return (
    <>
      <Text variant="sm-display" mb={1} mt={2}>
        Alert name
      </Text>
      <Input
        placeholder={placeholderState}
        value={values.name}
        onChangeText={handleChange("name")}
        onBlur={handleBlur("name")}
        error={errors.name}
        testID="alert-input-name"
        maxLength={75}
        // Android doesn't ellipsize long text, and instead wraps it to the next line.
        // This makes the text look like it's cut off
        // See: https://github.com/facebook/react-native/issues/29663
        multiline={Platform.OS === "android"}
      />
    </>
  )
}

interface SavedSearchNameInputQueryRendererProps {
  attributes: SearchCriteriaAttributes
}

export const SavedSearchNameInputQueryRenderer: React.FC<
  SavedSearchNameInputQueryRendererProps
> = ({ attributes }) => {
  return (
    <QueryRenderer<SavedSearchNameInputQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query SavedSearchNameInputQuery($attributes: PreviewSavedSearchAttributes!) {
          previewSavedSearch(attributes: $attributes) {
            displayName
          }
        }
      `}
      variables={{
        attributes: omit(attributes, ["displayName", "dimensionRange", "height", "width"]),
      }}
      render={({ props, error }) => {
        if (error) {
          console.error(error)
        }

        return <SavedSearchNameInput placeholder={props?.previewSavedSearch?.displayName} />
      }}
    />
  )
}
