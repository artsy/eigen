import {
  Button,
  Flex,
  Message,
  ProgressBar,
  RadioButton,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { Expandable } from "app/Components/Expandable"
import * as Updates from "expo-updates"
import { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"

type ExpoDeployment = "Canary" | "Staging" | "Production"

const expoDeploymentChannels: Record<ExpoDeployment, string> = {
  Staging: "staging",
  Production: "production",
  Canary: "canary",
}

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

  const fetchAndApplyUpdate = async () => {
    setLoading(true)
    setLoadProgress(0)
    setLoadStatus("Checking for update...")
    setErrorMessage(null)

    try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
        setLoadStatus("Update available, downloading...")
        const result = await Updates.fetchUpdateAsync()
        setLoadProgress(100)
        setLoadStatus("Update downloaded, restarting app...")
        await Updates.reloadAsync()
      } else {
        setLoadStatus("No updates available for this channel.")
      }
    } catch (error) {
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
              onPress={() => setSelectedDeployment(deployment as ExpoDeployment)}
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
