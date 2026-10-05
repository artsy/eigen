import { Flex, Pill, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { HOME_FEED_ARMS } from "app/Scenes/MyProfile/DevicePrefsModel"
import { GlobalStore } from "app/store/GlobalStore"

export const HomeFeedArmOptions: React.FC = () => {
  const homeFeedArm = GlobalStore.useAppState((state) => state.devicePrefs.homeFeedArm)
  const env = GlobalStore.useAppState((state) => state.devicePrefs.environment.env)
  const setHomeFeedArm = GlobalStore.actions.devicePrefs.setHomeFeedArm

  const isIgnoredOnProd = env === "production" && homeFeedArm !== "off"

  return (
    <>
      <Flex mx={2}>
        <Separator borderColor="mono100" />
      </Flex>
      <Spacer y={0.5} />

      <Flex mx={2}>
        <Text variant="sm-display" color="mono100">
          Home Feed Arm
        </Text>
        <Text variant="xs" color="mono60">
          Forces the server-composed home feed arm via the x-home-feed-arm header. Staging MP only.
          Refresh the home view to apply.
        </Text>

        <Flex flexDirection="row" flexWrap="wrap" mt={0.5}>
          {HOME_FEED_ARMS.map((option) => (
            <Pill
              key={option}
              variant="default"
              mr={0.5}
              mt={0.5}
              selected={homeFeedArm === option}
              onPress={() => setHomeFeedArm(option)}
            >
              {option}
            </Pill>
          ))}
        </Flex>

        {!!isIgnoredOnProd && (
          <Text variant="xs" color="red100" mt={0.5}>
            Environment is Production — MP ignores this override. Switch to Staging.
          </Text>
        )}
      </Flex>
    </>
  )
}
