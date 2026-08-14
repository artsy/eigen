import {
  Button,
  Flex,
  Message,
  ProgressBar,
  RadioButton,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import * as Sentry from "@sentry/react-native"
import { Expandable } from "app/Components/Expandable"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import * as Updates from "expo-updates"
import { useEffect, useState } from "react"
import { Alert } from "react-native"

type ExpoDeployment = "Canary" | "Staging" | "Production"

const expoDeploymentChannels: Record<ExpoDeployment, string> = {
  Staging: "staging",
  Production: "production",
  Canary: "canary",
}

const channelToDeployment: Record<string, ExpoDeployment> = Object.fromEntries(
  Object.entries(expoDeploymentChannels).map(([deployment, channel]) => [
    channel,
    deployment as ExpoDeployment,
  ])
)

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  )
}

export const ExpoUpdatesOptions = () => {
  const [selectedDeployment, setSelectedDeployment] = useState<ExpoDeployment>("Staging")
  const [updateMetadata, setUpdateMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadStatus, setLoadStatus] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)

  const updatesEnabled = Updates.isEnabled
  const channelSwitchingAllowed = updatesEnabled && ArtsyNativeModule.isBetaOrDev

  const fetchUpdateMetadata = async () => {
    try {
      const info = {
        updateId: Updates.updateId,
        channel: Updates.channel,
        runtimeVersion: Updates.runtimeVersion,
        isEmbeddedLaunch: Updates.isEmbeddedLaunch,
        isEmergencyLaunch: Updates.isEmergencyLaunch,
        manifest: Updates.manifest,
      }
      if (Updates.channel) {
        const deployment = channelToDeployment[Updates.channel]
        setSelectedDeployment(deployment)
      }
      setUpdateMetadata(info)
    } catch (error) {
      console.error("Failed to fetch update metadata:", error)
      setErrorMessage(`Error fetching metadata: ${error}`)
    }
  }

  useEffect(() => {
    fetchUpdateMetadata()
  }, [])

  const activeReleaseText = `
    Update ID: ${updateMetadata?.updateId || "N/A"}
    Channel: ${updateMetadata?.channel || "N/A"}
    Runtime Version: ${updateMetadata?.runtimeVersion || "N/A"}
    Embedded Launch: ${updateMetadata?.isEmbeddedLaunch ? "Yes" : "No"}
    Emergency Launch: ${updateMetadata?.isEmergencyLaunch ? "Yes" : "No"}
  `

  const handleSelectDeployment = (deployment: ExpoDeployment) => {
    setErrorMessage(null)
    const channelName = expoDeploymentChannels[deployment]

    try {
      Updates.setUpdateRequestHeadersOverride({ "expo-channel-name": channelName })
    } catch (error) {
      setErrorMessage(
        isErrorWithMessage(error) ? error.message : `Could not switch to ${channelName}: ${error}`
      )
      return
    }

    setSelectedDeployment(deployment)

    Alert.alert(
      "Deployment Channel Changed",
      "Quit and restart the app to apply the new deployment channel.",
      [
        {
          text: "I will crash now!",
          style: "destructive",
          onPress: () => {
            if (!__DEV__) {
              // Crash the app to force a restart
              Sentry.nativeCrash()
            }
          },
        },
      ]
    )
  }

  const fetchAndApplyUpdate = async () => {
    setLoading(true)
    setLoadProgress(0)
    setLoadStatus("Checking for update...")
    setErrorMessage(null)

    try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
        setLoadStatus("Update available, downloading...")
        await Updates.fetchUpdateAsync()
        setLoadProgress(100)
        await Updates.reloadAsync()
      } else {
        if (update.reason) {
          if (
            update.reason ===
            Updates.UpdateCheckResultNotAvailableReason.NO_UPDATE_AVAILABLE_ON_SERVER
          ) {
            setErrorMessage("No new update available.")
          } else {
            setErrorMessage(`Update check failed: ${update.reason}`)
          }
        } else {
          setErrorMessage("No new update available.")
        }
      }
    } catch (error) {
      if (
        isErrorWithMessage(error) &&
        error?.message?.includes("Code signature validation failed") &&
        error?.message?.includes("No expo-signature header specified")
      ) {
        // Expo mistakenly treats 304s as code signing errors when it actually means no updates available
        setErrorMessage("No updates available for this channel.")
        return
      }

      if (isErrorWithMessage(error)) {
        setErrorMessage(`Error fetching update: ${error.message}`)
        return
      }

      console.error("Error fetching Expo update:", error)
      setErrorMessage(`Error fetching update: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex mx={2}>
      <Expandable label="Expo Updates" expanded={false}>
        <Flex my={2}>
          {!updatesEnabled && (
            <>
              <Message
                title="Expo Updates disabled"
                text="This build has expo-updates disabled (local Debug builds always do), so the channel cannot be changed. Please use a TestFlight or Firebase beta."
                variant="warning"
              />
              <Spacer y={2} />
            </>
          )}

          {!!updateMetadata && (
            <>
              <Message title="Active Release" text={activeReleaseText} variant="info" />
              <Spacer y={2} />
            </>
          )}

          {!!updatesEnabled && !channelSwitchingAllowed && (
            <>
              <Message
                title="Channel switching unavailable"
                text="Channel switching is only available in dev or beta builds."
                variant="error"
              />
              <Spacer y={2} />
            </>
          )}

          {Object.keys(expoDeploymentChannels).map((deployment) => (
            <RadioButton
              key={deployment}
              testID={`expo-deployment-${deployment}`}
              accessibilityLabel={deployment}
              accessibilityState={{ checked: deployment === selectedDeployment }}
              text={deployment}
              selected={deployment === selectedDeployment}
              disabled={!channelSwitchingAllowed}
              onPress={() => handleSelectDeployment(deployment as ExpoDeployment)}
              mb={1}
            />
          ))}

          {loadProgress > 0 && (
            <Flex mt={2}>
              <Text>{loadStatus}</Text>
              <ProgressBar progress={loadProgress} />
            </Flex>
          )}

          {!!errorMessage && (
            <Flex mt={2}>
              <Message title="Something went wrong" text={errorMessage} variant="error" />
            </Flex>
          )}

          <Spacer y={2} />

          <Button block loading={loading} disabled={!updatesEnabled} onPress={fetchAndApplyUpdate}>
            Fetch and Run Deployment
          </Button>
        </Flex>
      </Expandable>
    </Flex>
  )
}
