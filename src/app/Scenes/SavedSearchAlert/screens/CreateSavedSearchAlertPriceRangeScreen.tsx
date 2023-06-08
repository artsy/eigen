import { Flex, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"

type Props = StackScreenProps<
  CreateSavedSearchAlertNavigationStack,
  "CreateSavedSearchAlertPriceRangeScreen"
>

export const CreateSavedSearchAlertPriceRangeScreen: React.FC<Props> = (props) => {
  const { navigation } = props

  return (
    <Flex>
      <FancyModalHeader
        onLeftButtonPress={() => {
          requestAnimationFrame(() => {
            navigation.goBack()
          })
        }}
      >
        Price
      </FancyModalHeader>
      <Text>Price Range is coming soon..</Text>
    </Flex>
  )
}
