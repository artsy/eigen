import {
  Button,
  CloseIcon,
  EditIcon,
  Flex,
  Join,
  LinkIcon,
  Pill,
  Spacer,
  Text,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { IVariant, useFlags } from "@unleash/proxy-client-react"
import { FONTS } from "app/Components/HTML"
import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore } from "app/store/GlobalStore"
import { EXPERIMENT_NAME, ExperimentDescriptor, experiments } from "app/system/flags/experiments"
import { isEmpty } from "lodash"
import { useState } from "react"
import { Alert, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native"

export const ExperimentFlagItem: React.FC<{ description: string; flag: EXPERIMENT_NAME }> = ({
  description,
  flag,
}) => {
  const unleashVariant = useFlags().find((e) => e.name === flag)?.variant as IVariant
  const localPayloadOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localPayloadOverrides
  )
  const localVariantOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localVariantOverrides
  )

  const { setLocalVariantOverride, setLocalPayloadOverride } =
    GlobalStore.actions.artsyPrefs.experiments

  const localExperiment = experiments[flag] as ExperimentDescriptor

  const toast = useToast()
  const [variant, setVariant] = useState(localVariantOverrides[flag])
  const [payload, setPayload] = useState(localPayloadOverrides[flag])
  const space = useSpace()
  const [visible, setVisible] = useState(false)

  const hasOverride = !!localPayloadOverrides[flag] || !!localVariantOverrides[flag]

  return (
    <Flex py={1} px={2}>
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => {
          setVisible(false)
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setVisible(false)
          }}
        >
          <Flex
            height="100%"
            width="100%"
            justifyContent="center"
            alignItems="center"
            backgroundColor="rgba(0,0,0,0.5)"
          >
            <Flex
              minHeight={650}
              width="95%"
              backgroundColor="mono0"
              borderRadius={20}
              // This is needed to avoid closing the modal on taps
              onStartShouldSetResponder={() => true}
            >
              <Flex px={2} pt={4}>
                <Flex position="absolute" right={space(2)} top={space(2)}>
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <CloseIcon height={24} width={24} />
                  </TouchableOpacity>
                </Flex>
                <Join separator={<Spacer y={1} />}>
                  <Text>
                    Key: <Text fontWeight="bold">{flag}</Text>
                  </Text>
                  <Text variant="xs" color="mono60">
                    - Unleash values have (default) around them.{"\n"}- The values you set here will
                    override the ones coming from Unleash.
                  </Text>

                  <Flex>
                    <Text mb={1} fontWeight="bold">
                      Variant:
                    </Text>
                    <CustomInput value={variant} onChangeText={setVariant} />

                    {!isEmpty(localExperiment.variantSuggestions) ? (
                      <Flex flexDirection="row" mt={1} flexWrap="wrap" justifyContent="flex-end">
                        <Text color="mono100" variant="xs" mt="3px" mr={0.5}>
                          Suggestions:
                        </Text>
                        {localExperiment.variantSuggestions?.map((variantSuggestion) => {
                          return (
                            <Pill
                              variant="badge"
                              mr={0.5}
                              mb={0.5}
                              key={variantSuggestion}
                              onPress={() => {
                                setVariant(variantSuggestion)
                              }}
                            >
                              {variantSuggestion}{" "}
                              {unleashVariant?.name === variantSuggestion && "(default)"}
                            </Pill>
                          )
                        })}
                      </Flex>
                    ) : (
                      <Flex flexDirection="row" mt={1} flexWrap="wrap" justifyContent="flex-end">
                        <Text color="mono100" variant="xs" mt="3px" mr={0.5}>
                          Suggestions:
                        </Text>
                        <Pill
                          variant="badge"
                          mr={0.5}
                          onPress={() => {
                            setVariant("control")
                          }}
                        >
                          control {unleashVariant.name === "control" && "(default)"}
                        </Pill>
                        <Pill
                          variant="badge"
                          onPress={() => {
                            setVariant("experiment")
                          }}
                        >
                          experiment {unleashVariant.name === "experiment" && "(default)"}
                        </Pill>
                      </Flex>
                    )}
                  </Flex>

                  <Flex>
                    <Text mb={1} fontWeight="bold">
                      Payload:
                    </Text>
                    <CustomInput value={payload} onChangeText={setPayload} />
                    {!isEmpty(localExperiment.payloadSuggestions) && (
                      <Flex flexDirection="row" mt={1} flexWrap="wrap" justifyContent="flex-end">
                        <Text color="mono100" variant="xs" mt="3px" mr={0.5}>
                          Suggestions:
                        </Text>
                        {localExperiment.payloadSuggestions?.map((payloadSuggestion) => {
                          return (
                            <Pill
                              variant="badge"
                              mr={0.5}
                              mb={0.5}
                              key={payloadSuggestion}
                              onPress={() => {
                                setPayload(payloadSuggestion)
                              }}
                            >
                              {payloadSuggestion}{" "}
                              {unleashVariant.payload?.value === payloadSuggestion && "(default)"}
                            </Pill>
                          )
                        })}
                      </Flex>
                    )}
                  </Flex>
                </Join>
              </Flex>

              <Flex position="absolute" bottom={space(2)} px={2}>
                <Button
                  block
                  disabled={!hasOverride}
                  variant="outline"
                  onPress={() => {
                    Alert.alert(
                      "Remove Overrides",
                      "Values will be reset to the ones coming from Unleash. Do you want to continue?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Reset",
                          onPress: () => {
                            setVariant("")
                            setPayload("")
                            setLocalVariantOverride({ key: flag, value: null })
                            setLocalPayloadOverride({ key: flag, value: null })
                            setVisible(false)
                          },
                        },
                      ]
                    )
                  }}
                >
                  Remove overrides
                </Button>

                <Spacer y={1} />

                <Button
                  block
                  onPress={() => {
                    // Save the override
                    setLocalVariantOverride({ key: flag, value: variant })
                    setLocalPayloadOverride({ key: flag, value: payload })
                    setVisible(false)
                  }}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </TouchableWithoutFeedback>
      </Modal>

      <Text fontWeight="bold" selectable>
        {flag}
      </Text>
      <Text>
        <Text color="mono60">Status:</Text>{" "}
        {unleashVariant.enabled ? (
          <Text fontWeight="bold" color="blue100">
            enabled
          </Text>
        ) : (
          <Text fontWeight="bold" color="red100">
            disabled
          </Text>
        )}
      </Text>
      <Text>
        <Text color="mono60">Variant:</Text>{" "}
        <Text fontWeight="bold">{localVariantOverrides[flag] || unleashVariant.name}</Text>
        <TouchableOpacity
          onPress={() => {
            setVisible(true)
          }}
        >
          <EditIcon fill={hasOverride ? "red100" : "mono100"} ml={0.5} />
        </TouchableOpacity>
      </Text>
      <Flex flexDirection="row" flexWrap="wrap">
        <Text color="mono60">Payload: </Text>
        <Text fontWeight="bold" selectable>
          {unleashVariant.payload?.value || "--"}
          <TouchableOpacity
            onPress={() => {
              setVisible(true)
            }}
          >
            <EditIcon fill={hasOverride ? "red100" : "mono100"} ml={0.5} />
          </TouchableOpacity>
        </Text>
      </Flex>
      <Flex flexDirection="row">
        <Text color="mono60">Unleash Url: </Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(`https://unleash.artsy.net/projects/default/features/${flag}`)
            toast.show("URL copied to clipboard", "bottom")
          }}
        >
          <Text>
            Copy URL <LinkIcon />
          </Text>
        </TouchableOpacity>
      </Flex>
      <Text>
        <Text color="mono60">Description:</Text> {description}
      </Text>
    </Flex>
  )
}

/* Not using Input from palette here because it does not update after setting a suggestion */
const CustomInput: React.FC<{
  value: string | undefined
  onChangeText: (text: string) => void
}> = ({ value, onChangeText }) => {
  const color = useColor()

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      style={{
        color: color("mono100"),
        borderColor: "gray",
        borderWidth: 1,
        height: 45,
        paddingHorizontal: 20,
        fontFamily: FONTS.regular,
        fontSize: 16,
      }}
    />
  )
}
