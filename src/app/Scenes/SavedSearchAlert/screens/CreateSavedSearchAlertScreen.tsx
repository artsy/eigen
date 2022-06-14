import { StackScreenProps } from "@react-navigation/stack"
import { Box } from "palette"
import React from "react"
import { CreateSavedSearchAlertContentQueryRenderer } from "../containers/CreateSavedSearchContentContainer"
import { CreateSavedSearchAlertNavigationStack } from "../SavedSearchAlertModel"
import { SavedSearchStoreProvider } from "../SavedSearchStore"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { attributes, aggregations, entity, ...other } = route.params

  return (
    <SavedSearchStoreProvider initialData={{ attributes, aggregations, entity }}>
      <Box flex={1}>
        <CreateSavedSearchAlertContentQueryRenderer navigation={navigation} {...other} />
      </Box>
    </SavedSearchStoreProvider>
  )
}
