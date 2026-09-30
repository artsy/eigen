import { Button, Flex, Input, Message, ProgressBar, Spacer, Text } from "@artsy/palette-mobile"
import { Expandable } from "app/Components/Expandable"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { isCodedError } from "app/system/devTools/DevMenu/Components/ExpoUpdatesOptions"
import {
  fetchPreviewPR,
  parsePreviewChannel,
  PreviewPR,
} from "app/system/devTools/DevMenu/utils/previewPR"
import * as Updates from "expo-updates"
import { useState } from "react"
import { Alert } from "react-native"

export const PreviewPROptions = () => {
  const activePRNumber = parsePreviewChannel(Updates.channel)

  const [prNumber, setPrNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { isDownloading, downloadProgress } = Updates.useUpdates()

  const updatesEnabled = Updates.isEnabled
  const channelSwitchingAllowed = updatesEnabled && ArtsyNativeModule.isBetaOrDev

  const downloadAndRun = async (pr: PreviewPR) => {
    setErrorMessage(null)
    setLoading(true)
    const currentChannel = Updates.channel

    const revertChannelSwitch = () => {
      if (!currentChannel) {
        return
      }

      try {
        Updates.setUpdateRequestHeadersOverride({ "expo-channel-name": currentChannel })
      } catch (revertError) {
        console.error("Failed to restore the previous update channel:", revertError)
      }
    }

    try {
      Updates.setUpdateRequestHeadersOverride({ "expo-channel-name": pr.channel })

      const check = await Updates.checkForUpdateAsync()
      if (!check.isAvailable) {
        revertChannelSwitch()
        setErrorMessage(`No update has been published to ${pr.channel} yet.`)
        return
      }

      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    } catch (error) {
      // Android refuses to reload on an emergency launch. The update is already downloaded, so
      // reopening the app runs it.
      if (isCodedError(error) && error?.code === "ERR_UPDATES_RELOAD") {
        setErrorMessage(
          "Update downloaded, but the app can't reload itself. Force-quit and reopen the app to run it."
        )
        return
      }

      revertChannelSwitch()
      setErrorMessage(`Error downloading update: ${error instanceof Error ? error.message : error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!prNumber) {
      return
    }

    setErrorMessage(null)
    setLoading(true)

    try {
      const pr = await fetchPreviewPR(Number(prNumber))

      Alert.alert(
        "Switch to preview?",
        `PR #${pr.prNumber}: ${pr.title}\nCommit: ${pr.sha.slice(0, 7)}\nChannel: ${pr.channel}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Switch",
            onPress: () => downloadAndRun(pr),
          },
        ]
      )
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex mx={2}>
      <Expandable label="Preview PR" expanded={false}>
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

          {!!updatesEnabled && !ArtsyNativeModule.isBetaOrDev && (
            <>
              <Message
                title="Preview PRs unavailable"
                text="Preview PRs are only available in dev or beta builds. Production builds can't switch channels."
                variant="error"
              />
              <Spacer y={2} />
            </>
          )}

          {activePRNumber !== null && (
            <>
              <Message
                title="Active Preview"
                text={`Channel: ${Updates.channel}\nPR: #${activePRNumber}`}
                variant="info"
              />
              <Spacer y={2} />
            </>
          )}

          <>
            <Input
              aria-label="PR Number"
              title="PR Number"
              keyboardType="number-pad"
              returnKeyType="go"
              editable={channelSwitchingAllowed}
              value={prNumber}
              onChangeText={(text) => setPrNumber(text.replace(/\D/g, ""))}
              onSubmitEditing={handleSubmit}
              autoCorrect={false}
            />

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
              loading={loading}
              disabled={!channelSwitchingAllowed || !prNumber}
              onPress={handleSubmit}
            >
              Load PR
            </Button>
          </>
        </Flex>
      </Expandable>
    </Flex>
  )
}
