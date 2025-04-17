import { Flex, Join, Separator, Text } from "@artsy/palette-mobile"
import { Expandable } from "app/Components/Expandable"
import { GlobalStore } from "app/store/GlobalStore"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { ExperimentFlagItem } from "app/system/devTools/DevMenu/Components/ExperimentFlagItem"
import { EXPERIMENT_NAME, experiments } from "app/system/flags/experiments"
import { isEmpty } from "lodash"
import { Alert } from "react-native"

export const Experiments: React.FC<{}> = () => {
  const { resetOverrides } = GlobalStore.actions.artsyPrefs.experiments

  const localPayloadOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localPayloadOverrides
  )
  const localVariantOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localVariantOverrides
  )
  const hasOverrides = !isEmpty(localPayloadOverrides) || !isEmpty(localVariantOverrides)

  return (
    <Flex mx={2}>
      <Expandable label="Experiments" expanded={false}>
        <Flex mx={-2}>
          <Flex mt={1}>
            <Text variant="xs" px={2} color="mono60" italic>
              Hint: Long press key or payload to copy them into your clipboard
            </Text>
            <Join separator={<Separator borderColor="mono10" />}>
              {Object.entries(experiments)
                // Reverse the order so that the most recent experiments are at the top
                .reverse()
                .map(([key, value]) => {
                  return (
                    <ExperimentFlagItem
                      description={value.description}
                      key={key}
                      flag={key as EXPERIMENT_NAME}
                    />
                  )
                })}

              <DevMenuButtonItem
                title="Revert all experiments overrides"
                titleColor={hasOverrides ? "red100" : "mono60"}
                disabled={!hasOverrides}
                onPress={() => {
                  Alert.alert("Are you sure?", "This will reset all local experiment overrides", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Reset",
                      onPress: () => {
                        resetOverrides()
                      },
                    },
                  ])
                }}
              />
            </Join>
          </Flex>
        </Flex>
      </Expandable>
    </Flex>
  )
}
