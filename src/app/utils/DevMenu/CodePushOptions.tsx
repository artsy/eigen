import { Button, Flex, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { CollapseMenu } from "app/Components/CollapseMenu"
import React, { useState } from "react"
import CodePush from "react-native-code-push"
import Config from "react-native-config"
import { space } from "styled-system"

interface CodePushRelease {
  description: string
  deployment: string
  label: string
}

const codePushDeployments: string[] = ["Local", "Staging", "Production", "Canary"]
const codePushDeploymentKeys: { [key: string]: string } = {
  Local: "local",
  Staging: Config.CODE_PUSH_STAGING_DEPLOYMENT_KEY ?? "",
  Production: Config.CODE_PUSH_PRODUCTION_DEPLOYMENT_KEY ?? "",
  Canary: Config.CODE_PUSH_CANARY_DEPLOYMENT_KEY ?? "",
}

export const CodePushOptions = () => {
  // CODEPUSH States
  const [selectedDeployment, setSelectedDeployment] = useState("")
  const [currentRelease, setCurrentRelease] = useState<CodePushRelease | null>(null)
  const [loading, setLoading] = useState(false)

  const updateMetadata = () => {
    console.log("CODEPUSH: Called updateMetadata")
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then((update) => {
      console.log("CODEPUSH: Update metadata callback")
      if (update) {
        console.log("CODEPUSH: Update metadata callback found update", update)
        setCurrentRelease({
          description: update.description,
          deployment: selectedDeployment,
          label: update.label,
        })
        update.install(CodePush.InstallMode.IMMEDIATE).then((result) => {
          console.log("CODEPUSH: Install result", result)
        })
      }
    })
  }

  const chevronStyle = { marginRight: space(1) }

  return (
    <CollapseMenu title="Code Push" chevronStyle={chevronStyle}>
      <Flex mx={2} my={2}>
        {!!currentRelease && (
          <>
            <Text>Active Release:</Text>
            <Text>Description: {currentRelease?.description || "N/A"}</Text>
            <Text>Deployment: {currentRelease?.deployment || "N/A"}</Text>
            <Text>Label: {currentRelease?.label || "N/A"}</Text>

            <Spacer y={2} />
          </>
        )}

        {codePushDeployments.map((deployment) => {
          return (
            <React.Fragment key={deployment}>
              <Flex flexDirection="row">
                <RadioButton
                  selected={deployment == selectedDeployment}
                  onPress={() => setSelectedDeployment(deployment)}
                />
                <Text>{deployment}</Text>
              </Flex>
            </React.Fragment>
          )
        })}

        <Spacer y={2} />

        <Button
          block
          loading={loading}
          onPress={() => {
            const deploymentKey = codePushDeploymentKeys[selectedDeployment]
            console.log("CODEPUSH: Got selected deployment key for deployment", {
              selectedDeployment,
              deploymentKey,
            })
            setLoading(true)
            CodePush.sync(
              { deploymentKey: deploymentKey },
              (status) => {
                switch (status) {
                  case CodePush.SyncStatus.UPDATE_INSTALLED:
                    setLoading(false)
                    updateMetadata()
                    break
                  case CodePush.SyncStatus.UNKNOWN_ERROR:
                    setLoading(false)
                    // Optionally, you can also handle the error or display an error message here
                    break
                  default:
                    break
                }
              },
              (progress) => {
                console.log("CODEPUSH: Syncing with progress", progress)
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
