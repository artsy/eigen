import { Flex, Text } from "@artsy/palette-mobile"
import { ReloadButton } from "app/Components/ErrorViews/ReloadButton"
import { useDevToggle } from "app/utils/hooks/useDevToggle"

interface NotFoundFailureViewProps {
  error?: Error
  onRetry?: () => void
}

export const NetworkFailureView: React.FC<NotFoundFailureViewProps> = ({ error, onRetry }) => {
  const isDevToggleEnabled = useDevToggle("DTShowErrorInLoadFailureView")
  const showErrorMessage = __DEV__ || isDevToggleEnabled

  return (
    <Flex flex={1}>
      <Flex flex={1} m={4} justifyContent="center" alignItems="center">
        <Text variant="lg-display" mb={1} textAlign="center">
          We are having trouble loading this page.
        </Text>
        <Text variant="lg-display" color="black60" mb={4} textAlign="center">
          Please check your connnection and try again.
        </Text>

        {!!showErrorMessage && (
          <Flex my={2}>
            <Text>Error: {error?.message}</Text>
          </Flex>
        )}
        {!!onRetry && <ReloadButton onRetry={onRetry} />}
      </Flex>
    </Flex>
  )
}
