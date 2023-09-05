import {
  Button,
  Flex,
  Message,
  ProgressBar,
  RadioButton,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { CollapseMenu } from "app/Components/CollapseMenu"
import React, { useEffect, useState } from "react"
import CodePush from "react-native-code-push"
import Config from "react-native-config"

interface CodePushRelease {
  description: string
  deployment: string
  label: string
}

const stagingKey = Config.CODE_PUSH_STAGING_DEPLOYMENT_KEY ?? "Staging_Key"
const productionKey = Config.CODE_PUSH_PRODUCTION_DEPLOYMENT_KEY ?? "Production_Key"
const canaryKey = Config.CODE_PUSH_CANARY_DEPLOYMENT_KEY ?? "Canary_Key"

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
    <CollapseMenu title="Code Push" chevronStyle={{ marginRight: 10 }}>
      <Flex mx={2} my={2}>
        {!!currentRelease && (
          <>
            <Message title="Active Release" text={activeReleaseText} variant="info" />
            <Spacer y={2} />
          </>
        )}
        {Object.keys(codePushDeploymentKeys).map((deployment) => {
          return (
            <React.Fragment key={deployment}>
              <Flex flexDirection="row">
                <RadioButton
                  selected={deployment == selectedDeployment}
                  onPress={() => setSelectedDeployment(deployment as CodePushDeployment)}
                />
                <Text>{deployment}</Text>
              </Flex>
            </React.Fragment>
          )
        })}

        <Spacer y={2} />

        {loadProgress > 0 && (
          <>
            <Text>{loadStatus}</Text>
            <ProgressBar progress={loadProgress} />
          </>
        )}

        <Spacer y={2} />

        <Button
          block
          loading={loading}
          onPress={() => {
            const deploymentKey = codePushDeploymentKeys[selectedDeployment]
            setLoading(true)
            CodePush.sync(
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
                    setLoadStatus("Sync failed with error, try again or check deployment")
                    setLoading(false)
                    break
                  default:
                    break
                }
              },
              (progress) => {
                const loadProgress = (progress.receivedBytes / progress.totalBytes) * 100
                setLoadProgress(loadProgress)
              }
            )
          }}
        >
          Fetch and Run Deployment
        </Button>
      </Flex>
    </CollapseMenu>
  )
}
