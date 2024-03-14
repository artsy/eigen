import { Flex, LinkIcon, Text } from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { useToast } from "app/Components/Toast/toastHook"
import { EXPERIMENT_NAME } from "app/utils/experiments/experiments"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { TouchableOpacity } from "react-native"

export const ExperimentFlagItem: React.FC<{ description: string; flag: EXPERIMENT_NAME }> = ({
  description,
  flag,
}) => {
  const experiment = useExperimentVariant(flag)
  const toast = useToast()

  return (
    <Flex py={1} px={2}>
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
      </Text>
      <Flex flexDirection="row" flexWrap="wrap">
        <Text color="black60">Payload: </Text>
        <Text fontWeight="bold" selectable>
          {experiment.payload}
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
