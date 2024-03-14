import { Flex, Join, Separator, Text } from "@artsy/palette-mobile"
import { Expandable } from "app/Components/Expandable"
import { GlobalStore } from "app/store/GlobalStore"
import { ExperimentFlagItem } from "app/system/devTools/DevMenu/Components/ExperimentFlagItem"
import { EXPERIMENT_NAME, experiments } from "app/utils/experiments/experiments"

export const Experiments: React.FC<{}> = () => {
  const {} = GlobalStore.actions.artsyPrefs.experiments

  return (
    <Flex mx={2}>
      <Expandable label="Experiments" expanded>
        {/* <Expandable label="Experiments" expanded={false}> */}
        <Flex mx={-2}>
          <Flex mt={1}>
            <Text variant="xs" px={2} color="black60" italic>
              Hint: Long press key or payload to copy them into your clipboard
            </Text>
            <Join separator={<Separator borderColor="black10" />}>
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
            </Join>
          </Flex>
        </Flex>
      </Expandable>
    </Flex>
  )
}
