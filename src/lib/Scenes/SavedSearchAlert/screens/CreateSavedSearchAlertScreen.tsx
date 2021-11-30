import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box } from "palette"
import React from "react"
import { CreateSavedSearchContentContainerV1 } from "../containers/CreateSavedSearchContentContainerV1"
import { CreateSavedSearchAlertContentQueryRenderer } from "../containers/CreateSavedSearchContentContainerV2"
import { CreateSavedSearchAlertNavigationStack } from "../SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { me, onClosePress, ...other } = route.params
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  return (
    <Box flex={1}>
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      {isEnabledImprovedAlertsFlow ? (
        <CreateSavedSearchAlertContentQueryRenderer navigation={navigation} {...other} />
      ) : (
        <CreateSavedSearchContentContainerV1 navigation={navigation} me={me} {...other} />
      )}
    </Box>
  )
}
