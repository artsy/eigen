import { Flex, Pill } from "@artsy/palette-mobile"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"

export const NewActivityHeader: React.FC = () => {
  const type = ActivityScreenStore.useStoreState((state) => state.type)
  const setType = ActivityScreenStore.useStoreActions((actions) => actions.setType)

  return (
    <Flex px={2} pb={2}>
      <Flex flexDirection="row">
        <Pill variant="default" selected={type === "all"} mr={0.5} onPress={() => setType("all")}>
          All
        </Pill>
        <Pill
          variant="default"
          mr={0.5}
          selected={type === "alerts"}
          onPress={() => setType("alerts")}
        >
          Alerts
        </Pill>
        <Pill
          variant="default"
          mr={0.5}
          selected={type === "offers"}
          onPress={() => setType("offers")}
        >
          Offers
        </Pill>
      </Flex>
    </Flex>
  )
}
