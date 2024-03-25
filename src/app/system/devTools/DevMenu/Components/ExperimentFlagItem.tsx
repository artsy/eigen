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
  useSpace,
} from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { FONTS } from "app/Components/HTML"
import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore } from "app/store/GlobalStore"
import {
  EXPERIMENT_NAME,
  ExperimentDescriptor,
  experiments,
} from "app/utils/experiments/experiments"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { isEmpty } from "lodash"
import { useState } from "react"
import { Alert, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native"

export const ExperimentFlagItem: React.FC<{ description: string; flag: EXPERIMENT_NAME }> = ({
  description,
  flag,
}) => {
  const experiment = useExperimentVariant(flag)
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
  const [variant, setVariant] = useState(experiment.variant)
  const [payload, setPayload] = useState(experiment.payload)
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
              minHeight={600}
              width="95%"
              backgroundColor="white100"
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
                <Join separator={<Spacer y={2} />}>
                  <Text>
                    Key: <Text fontWeight="bold">{flag}</Text>
                  </Text>
                  <Text variant="xs" color="black60">
                    - Unleash values have (default) around them.{"\n"}- The values you set here will
                    override the ones coming from Unleash.
                  </Text>

                  <Flex>
                    <Text mb={1} fontWeight="bold">
                      Variant:
                    </Text>
                    <CustomInput value={variant} onChangeText={setVariant} />

                    <Flex flexDirection="row" mt={1} flexWrap="wrap" justifyContent="flex-end">
                      <Text color="black100" variant="xs" mt="3px" mr={0.5}>
                        Suggestions:
                      </Text>
                      <Pill
                        variant="badge"
                        mr={0.5}
                        onPress={() => {
                          setVariant("control")
                        }}
                      >
                        control {experiment.unleashVariant === "control" && "(default)"}
                      </Pill>
                      <Pill
                        variant="badge"
                        onPress={() => {
                          setVariant("experiment")
                        }}
                      >
                        experiment {experiment.unleashVariant === "experiment" && "(default)"}
                      </Pill>
                    </Flex>
                  </Flex>

                  <Flex>
                    <Text my={1} fontWeight="bold">
                      Payload:
                    </Text>
                    <CustomInput value={payload} onChangeText={setPayload} />
                    {!isEmpty(localExperiment.payloadSuggestions) && (
                      <Flex flexDirection="row" mt={1} flexWrap="wrap" justifyContent="flex-end">
                        <Text color="black100" variant="xs" mt="3px" mr={0.5}>
                          Suggestions:
                        </Text>
                        {localExperiment.payloadSuggestions?.map((payloadSuggestion) => {
                          return (
                            <Pill
                              variant="badge"
                              mr={0.5}
                              key={payloadSuggestion}
                              onPress={() => {
                                setPayload(payloadSuggestion)
                              }}
                            >
                              {payloadSuggestion}{" "}
                              {experiment.unleashPayload === payloadSuggestion && "(default)"}
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
                  disabled={hasOverride}
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
                            setVariant(experiment.variant)
                            setPayload(experiment.payload)
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
        <Text color="black60">Status:</Text>{" "}
        {experiment.enabled ? (
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
        <Text color="black60">Variant:</Text> <Text fontWeight="bold">{experiment.variant}</Text>
        <TouchableOpacity
          onPress={() => {
            setVisible(true)
          }}
        >
          <EditIcon fill={hasOverride ? "red100" : "black100"} ml={0.5} />
        </TouchableOpacity>
      </Text>
      <Flex flexDirection="row" flexWrap="wrap">
        <Text color="black60">Payload: </Text>
        <Text fontWeight="bold" selectable>
          {experiment.payload || "--"}
          <TouchableOpacity
            onPress={() => {
              setVisible(true)
            }}
          >
            <EditIcon fill={hasOverride ? "red100" : "black100"} ml={0.5} />
          </TouchableOpacity>
        </Text>
      </Flex>
      <Flex flexDirection="row">
        <Text color="black60">Unleash Url: </Text>
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
        <Text color="black60">Description:</Text> {description}
      </Text>
    </Flex>
  )
}

/* Not using Input from palette here because it does not update after setting a suggestion */
const CustomInput: React.FC<{
  value: string | undefined
  onChangeText: (text: string) => void
}> = ({ value, onChangeText }) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={{
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
