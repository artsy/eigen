import { Flex, Text } from "@artsy/palette-mobile"

interface Props {
  message?: string
}

export const ErrorView: React.FC<Props> = ({ message }) => (
  <Flex alignItems="center" justifyContent="center" height="100%">
    <Flex maxWidth={280}>
      <Text variant="sm" textAlign="center">
        {message ||
          "There seems to be a problem with submission creation. Please try again shortly."}
      </Text>
    </Flex>
  </Flex>
)
