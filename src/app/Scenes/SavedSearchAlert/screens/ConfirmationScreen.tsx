import { Box, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Pill } from "app/Components/Pill"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { ScrollView } from "react-native"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">

export const ConfirmationScreen: React.FC<Props> = (props) => {
  const { route } = props
  const { closeModal } = route.params
  const pills = useSavedSearchPills()

  const handleLeftButtonPress = () => {
    closeModal?.()
  }

  return (
    <Box>
      <FancyModalHeader hideBottomDivider useXButton onLeftButtonPress={handleLeftButtonPress} />
      <Box px={2}>
        <Text variant="lg">Your alert has been saved</Text>

        <Spacer y={1} />

        <ScrollView>
          <Text variant="sm" color="black60">
            We’ll let you know when matching works are added to Artsy.
          </Text>

          <Spacer y={2} />

          <Flex flexDirection="row" flexWrap="wrap">
            <Join separator={<Spacer x={1} />}>
              {pills.map((pill) => {
                return (
                  <Pill key={`param-${pill.paramName}-value-${pill.value}`} block>
                    {pill.label}
                  </Pill>
                )
              })}
            </Join>
          </Flex>

          <Spacer y={2} />

          <Text pb={1000} backgroundColor="black10">
            Artworks TKTK
          </Text>
        </ScrollView>
      </Box>
    </Box>
  )
}
