import { Flex, Screen } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { MyCollectionQueryRenderer as MyCollectionLegacyQueryRenderer } from "./MyCollectionLegacy"

const MyCollection: React.FC = () => {
  return (
    <Screen>
      <Screen.Header title="My Collection" />
      <Screen.Body fullwidth>
        <Flex justifyContent="center" alignItems="center" flex={1} backgroundColor="red10"></Flex>
      </Screen.Body>
    </Screen>
  )
}

export const MyCollectionQueryRenderer: React.FC = () => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return <MyCollection />
  }

  return <MyCollectionLegacyQueryRenderer />
}
