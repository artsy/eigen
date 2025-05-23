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
import { Alert, TouchableOpacity } from "react-native"

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

export const ExpoUpdatesOptions = () => {
  const [selectedDeployment, setSelectedDeployment] = useState<ExpoDeployment>("Staging")
  const [updateMetadata, setUpdateMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadStatus, setLoadStatus] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)

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

  const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as any).message === "string"
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
          setErrorMessage(`Update check failed: ${update.reason}`)
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
          {!!updateMetadata && (
            <>
              <Message title="Active Release" text={activeReleaseText} variant="info" />
              <Spacer y={2} />
            </>
          )}

          {Object.keys(expoDeploymentChannels).map((deployment) => (
            <TouchableOpacity
              key={deployment}
              onPress={() => {
                if (!ArtsyNativeModule.isBetaOrDev) {
                  Alert.alert("Updates can only be changed in beta or dev mode.")
                  return
                }

                setSelectedDeployment(deployment as ExpoDeployment)
                const channelName = expoDeploymentChannels[deployment as ExpoDeployment]
                Updates.setUpdateURLAndRequestHeadersOverride({
                  updateUrl:
                    "https://expo-updates-api.artsy.net/api/manifest?project=eigen&channel=" +
                    channelName,
                  requestHeaders: {
                    "expo-channel-name": expoDeploymentChannels[deployment as ExpoDeployment],
                  },
                })

                Alert.alert(
                  "Deployment Changed",
                  "Quit and restart the app to apply the new deployment.",
                  [
                    {
                      text: "I will crash now!",
                      style: "destructive",
                      onPress: () => {
                        // Crash the app to force a restart
                        Sentry.nativeCrash()
                      },
                    },
                  ]
                )
              }}
            >
              <Flex flexDirection="row" alignItems="center">
                <RadioButton selected={deployment === selectedDeployment} />
                <Text>{deployment}</Text>
              </Flex>
            </TouchableOpacity>
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

          <Button block loading={loading} onPress={fetchAndApplyUpdate}>
            Fetch and Run Deployment
          </Button>
        </Flex>
      </Expandable>
    </Flex>
  )
}
