import { ChevronSmallDownIcon, ChevronSmallRightIcon } from "@artsy/icons/native"
import { Flex, Pill, Separator, Spacer, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { GlobalStore, globalStoreInstance } from "app/store/GlobalStore"
import { EnvironmentKey, environment } from "app/store/config/EnvironmentModel"
import { _globalCacheRef } from "app/system/relay/defaultEnvironment"
import { capitalize } from "lodash"
import { useState } from "react"
import { Alert, Platform, TouchableHighlight } from "react-native"

type Environment = "staging" | "production"

const ENVIRONMENTS: Environment[] = ["staging", "production"]

export const EnvironmentOptions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const color = useColor()
  const { env, localOverrides, strings } = GlobalStore.useAppState(
    (store) => store.devicePrefs.environment
  )
  const hasLocalOverrides = Object.entries(localOverrides).some(
    ([key, value]) => value !== environment[key as EnvironmentKey].presets[env]
  )
  // show custom url options if there are already local overrides in effect, or if the user has tapped
  // the option to set custom overrides during the lifetime of this component
  const [showCustomURLOptions, setShowCustomURLOptions] = useState(hasLocalOverrides)

  const switchEnvironment = (newEnv: Environment) => {
    Alert.alert(`Log out and switch to '${capitalize(newEnv)}'?`, undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out & Switch",
        style: "destructive",
        onPress: async () => {
          GlobalStore.actions.devicePrefs.environment.clearLocalOverrides()
          // Sign out (and let its cascading state reset settle) before switching environments, so
          // the app doesn't remount against a stale, mid-sign-out auth state.
          if (!!globalStoreInstance().getState().auth.userID) {
            await GlobalStore.actions.auth.signOut()
          }
          GlobalStore.actions.devicePrefs.environment.setEnv(newEnv)
          setShowCustomURLOptions(false)
          _globalCacheRef?.clear()
          onClose()
        },
      },
    ])
  }

  return (
    <>
      <Flex mx={2}>
        <Separator borderColor="mono100" />
      </Flex>
      <Spacer y={0.5} />

      <Flex mx={2} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text variant="sm-display" color="mono100">
          Environment
        </Text>

        <Flex flexDirection="row">
          {ENVIRONMENTS.map((option) => (
            <Pill
              key={option}
              variant="default"
              ml={0.5}
              selected={env === option}
              onPress={() => {
                if (option !== env) {
                  switchEnvironment(option)
                }
              }}
            >
              {capitalize(option)}
            </Pill>
          ))}
        </Flex>
      </Flex>

      {!!ArtsyNativeModule.isBetaOrDev && (
        <>
          <Spacer y={0.5} />

          <Flex mx={2} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Touchable
              accessibilityRole="button"
              onPress={() => setShowCustomURLOptions(!showCustomURLOptions)}
            >
              <Flex flexDirection="row" alignItems="center">
                <Text
                  variant="xs"
                  color={showCustomURLOptions ? "blue100" : "mono60"}
                  underline={showCustomURLOptions}
                >
                  {showCustomURLOptions ? "Hide Custom URLs" : "Tap to Customize URLs"}
                </Text>

                {showCustomURLOptions ? (
                  <ChevronSmallDownIcon fill="blue100" ml="2px" />
                ) : (
                  <ChevronSmallRightIcon fill="mono60" ml="2px" />
                )}
              </Flex>
            </Touchable>

            {!!hasLocalOverrides && (
              <Pill
                variant="default"
                onPress={() => {
                  GlobalStore.actions.devicePrefs.environment.clearLocalOverrides()
                }}
              >
                Reset to default
              </Pill>
            )}
          </Flex>
        </>
      )}

      {Platform.OS === "android" && !!showCustomURLOptions && (
        <Flex px={2}>
          <Text color="red100" variant="xs">
            You are using{" "}
            <Text color="red100" fontWeight="bold" variant="xs">
              Android
            </Text>
            . In order to use your local environment, you need to replace localhost inside{" "}
            <Text color="red100" fontWeight="bold" variant="xs">
              EnvironmentModel.tsx
            </Text>{" "}
            with your IP address and port.
          </Text>
        </Flex>
      )}
      {!!showCustomURLOptions &&
        Object.entries(environment).map(([key, { description, presets }]) => {
          const defaultValue = presets[env]
          const currentValue = strings[key as EnvironmentKey]
          const isOverriddenFromDefault = currentValue !== defaultValue

          return (
            <TouchableHighlight
              accessibilityRole="button"
              key={key}
              underlayColor={color("mono5")}
              onPress={() => {
                Alert.alert(
                  description,
                  `Default: ${defaultValue}`,
                  Object.entries(presets).map(([name, value]) => ({
                    text: name,
                    onPress: () => {
                      GlobalStore.actions.devicePrefs.environment.setLocalOverride({
                        key: key as EnvironmentKey,
                        value,
                      })
                    },
                  }))
                )
              }}
            >
              <Flex
                ml={2}
                mr="15px"
                my="5px"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex>
                  <Text variant="xs" color="mono60" mb="0.5">
                    {description}
                  </Text>
                  <Flex key={key} flexDirection="row" justifyContent="space-between">
                    <Text
                      variant="sm-display"
                      color={isOverriddenFromDefault ? "blue100" : "mono100"}
                      fontWeight={isOverriddenFromDefault ? "bold" : "normal"}
                    >
                      {currentValue}
                    </Text>
                  </Flex>
                </Flex>
                <ChevronSmallRightIcon fill="mono60" />
              </Flex>
            </TouchableHighlight>
          )
        })}
    </>
  )
}
