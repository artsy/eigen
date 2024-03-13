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
import { canaryKey, productionKey, stagingKey } from "app/system/codepush"
import { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import CodePush from "react-native-code-push"
import DeviceInfo from "react-native-device-info"

interface CodePushRelease {
  description: string
  deployment: string
  label: string
}

type CodePushDeployment = "Staging" | "Production" | "Canary"

const codePushDeploymentKeys: Record<CodePushDeployment, string> = {
  Staging: stagingKey,
  Production: productionKey,
  Canary: canaryKey,
}

const codePushKeyToDeployment: { [key: string]: CodePushDeployment } = {
  [stagingKey]: "Staging",
  [productionKey]: "Production",
  [canaryKey]: "Canary",
}

export const CodePushOptions = () => {
  const [selectedDeployment, setSelectedDeployment] = useState<CodePushDeployment>("Staging")
  const [currentRelease, setCurrentRelease] = useState<CodePushRelease | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadStatus, setLoadStatus] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)

  const updateMetadata = () => {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then((update) => {
      if (update) {
        const deployment = codePushKeyToDeployment[update.deploymentKey] ?? "unknown"
        setCurrentRelease({
          description: update.description,
          deployment: deployment,
          label: update.label,
        })
      }
    })
  }

  useEffect(() => {
    updateMetadata()
  }, [])

  const activeReleaseText = `
    Description: ${currentRelease?.description || "N/A"}
    Deployment: ${currentRelease?.deployment || "N/A"}
    Label: ${currentRelease?.label || "N/A"}
  `

  return (
    <Flex mx={2}>
      <Expandable label="Code Push" expanded={false}>
        <Flex my={2}>
          {!!currentRelease && (
            <>
              <Message title="Active Release" text={activeReleaseText} variant="info" />
              <Spacer y={2} />
            </>
          )}

          {Object.keys(codePushDeploymentKeys).map((deployment) => {
            return (
              <TouchableOpacity
                key={deployment}
                onPress={() => setSelectedDeployment(deployment as CodePushDeployment)}
              >
                <Flex flexDirection="row" alignItems="center">
                  <RadioButton selected={deployment == selectedDeployment} />
                  <Text>{deployment}</Text>
                </Flex>
              </TouchableOpacity>
            )
          })}

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

          <Button
            block
            loading={loading}
            onPress={async () => {
              const deploymentKey = codePushDeploymentKeys[selectedDeployment]
              setLoading(true)
              setLoadProgress(0)
              setLoadStatus("")
              setErrorMessage(null)
              await CodePush.sync(
                { deploymentKey: deploymentKey, installMode: CodePush.InstallMode.IMMEDIATE },
                (status) => {
                  switch (status) {
                    case CodePush.SyncStatus.UPDATE_INSTALLED:
                      setLoadStatus("Update installed")
                      setLoading(false)
                      break
                    case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                      setLoadStatus("Checking server for update")
                      break
                    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                      setLoadStatus("Downloading update")
                      break
                    case CodePush.SyncStatus.INSTALLING_UPDATE:
                      setLoadStatus("Installing update, app will restart")
                      break
                    case CodePush.SyncStatus.UP_TO_DATE:
                      setLoadStatus("No updates available, checking for pending updates")
                      CodePush.getUpdateMetadata(CodePush.UpdateState.PENDING).then((update) => {
                        if (update) {
                          setLoadStatus("Update found, installing, the app will restart")
                          setLoading(false)
                          update.install(CodePush.InstallMode.IMMEDIATE)
                        } else {
                          setLoadStatus("No update found, check the deployment in codepush")
                          setLoading(false)
                        }
                      })
                      break
                    case CodePush.SyncStatus.UNKNOWN_ERROR:
                      setErrorMessage("Sync failed with error, try again or check deployment")
                      setLoading(false)
                      break
                    default:
                      break
                  }
                },
                (progress) => {
                  const loadProgress = (progress.receivedBytes / progress.totalBytes) * 100
                  setLoadProgress(loadProgress)
                },
                (codePushPackage) => {
                  // binary version mismatch
                  const appVersion = DeviceInfo.getVersion()
                  const updateTargetVersion = codePushPackage.appVersion
                  const errorMessage = [
                    "An update is available but it doesn't match your current app version.",
                    "Maybe you need to update?",
                    `app version: ${appVersion}`,
                    `update target version: ${updateTargetVersion}`,
                  ].join("\n")
                  setErrorMessage(errorMessage)
                  setLoading(false)
                }
              )
            }}
          >
            Fetch and Run Deployment
          </Button>
        </Flex>
      </Expandable>
    </Flex>
  )
}
