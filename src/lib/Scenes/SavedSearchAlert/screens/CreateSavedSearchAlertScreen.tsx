import { StackScreenProps } from "@react-navigation/stack"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box } from "palette"
import React from "react"
import { CreateSavedSearchContentContainerV1 } from "../containers/CreateSavedSearchContentContainerV1"
import { CreateSavedSearchAlertContentQueryRenderer } from "../containers/CreateSavedSearchContentContainerV2"
import { CreateSavedSearchAlertNavigationStack } from "../SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { me, ...other } = route.params
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  return (
    <Box flex={1}>
      {isEnabledImprovedAlertsFlow ? (
        <CreateSavedSearchAlertContentQueryRenderer
          navigation={navigation}
          artistId={route.params.artistId}
          artistName={route.params.artistName}
          onClosePress={route.params.onClosePress}
          onComplete={route.params.onComplete}
        />
      ) : (
        <CreateSavedSearchContentContainerV1 navigation={navigation} me={me} {...other} />
      )}
    </Box>
  )
}
