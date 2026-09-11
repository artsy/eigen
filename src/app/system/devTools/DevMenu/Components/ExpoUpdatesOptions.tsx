import {
  Button,
  Flex,
  Message,
  ProgressBar,
  RadioButton,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/native"
import * as Sentry from "@sentry/react-native"
import { Expandable } from "app/Components/Expandable"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import * as Updates from "expo-updates"
import { useCallback, useEffect, useState } from "react"
import { Alert, Platform } from "react-native"

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

const isCodedError = (error: unknown): error is { code: string } => {
  return typeof error === "object" && error !== null && "code" in error
}

type CheckState = "checking" | "fetchable" | "upToDate" | "error"

export const ExpoUpdatesOptions = () => {
  const [selectedDeployment, setSelectedDeployment] = useState<ExpoDeployment>("Staging")
  const [updateMetadata, setUpdateMetadata] = useState<any>(null)
  const [checkState, setCheckState] = useState<CheckState>("checking")
  const [fetching, setFetching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { isDownloading, isUpdatePending, downloadProgress } = Updates.useUpdates()

  const updatesEnabled = Updates.isEnabled
  const channelSwitchingAllowed = updatesEnabled && ArtsyNativeModule.isBetaOrDev
  const canFetch = ["fetchable", "error"].includes(checkState)

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

  useFocusEffect(
    useCallback(() => {
      if (updatesEnabled && !isUpdatePending) {
        runCheck()
      }
    }, [updatesEnabled, isUpdatePending])
  )

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
        isErrorWithMessage(error)
          ? `Could not switch to ${channelName}: ${error.message}`
          : `Could not switch to ${channelName}: ${error}`
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

  const runCheck = async (withErrors = false) => {
    setCheckState("checking")
    setErrorMessage(null)

    try {
      const update = await Updates.checkForUpdateAsync()

      if (update.isAvailable) {
        setCheckState("fetchable")
        return
      }

      if (
        update.reason &&
        update.reason !== Updates.UpdateCheckResultNotAvailableReason.NO_UPDATE_AVAILABLE_ON_SERVER
      ) {
        setCheckState("error")
        !!withErrors && setErrorMessage(`Update check failed: ${update.reason}`)
        return
      }

      setCheckState("upToDate")
    } catch (error) {
      console.error("Error checking for Expo update:", error)
      setCheckState("error")
      !!withErrors &&
        setErrorMessage(
          `Error fetching update: ${isErrorWithMessage(error) ? error.message : error}`
        )
    } finally {
      setFetching(false)
    }
  }

  const fetchAndApplyUpdate = async () => {
    setFetching(true)
    setErrorMessage(null)

    if (checkState === "error") {
      await runCheck(true)
      return
    }

    if (checkState !== "fetchable") {
      return
    }

    try {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    } catch (error) {
      // Android refuses to reload when the app is on an emergency launch, since there's no
      // launched update to replace. The update is downloaded already, so force-quitting and
      // reopening the app will run it.
      if (isCodedError(error) && error.code === "ERR_UPDATES_RELOAD") {
        setErrorMessage(
          "Update downloaded, but the app can't reload itself. Force-quit and reopen the app to run it."
        )
        return
      }

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
      setFetching(false)
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
                text="This build has expo-updates disabled (local Debug builds always do), so the channel cannot be changed. Please use a Firebase beta."
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

          {!!updateMetadata?.isEmergencyLaunch && Platform.OS === "android" && (
            <>
              <Message
                title="Emergency launch"
                text={`Nothing was launchable last boot, so the app is running the embedded bundle.\nReason: ${
                  Updates.emergencyLaunchReason || "unknown"
                }\n\nFetching an update will still download it, but reloading it here will fail. Force-quit and reopen the app afterward to run it.`}
                variant="warning"
              />
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

          {!!isDownloading && (
            <Flex mt={2}>
              <Text>Downloading update…</Text>
              <ProgressBar progress={(downloadProgress ?? 0) * 100} />
            </Flex>
          )}

          {!!errorMessage && (
            <Flex mt={2}>
              <Message title="Something went wrong" text={errorMessage} variant="error" />
            </Flex>
          )}

          <Spacer y={2} />

          <Button
            block
            loading={fetching}
            disabled={!updatesEnabled || !canFetch}
            onPress={fetchAndApplyUpdate}
          >
            Fetch and Run Deployment
          </Button>
        </Flex>
      </Expandable>
    </Flex>
  )
}
