import { Flex, ProgressBar, Text } from "@artsy/palette-mobile"

interface SellUploadProgressProps {
  done: number
  total: number
  /** From 0 to 1 */
  fraction: number
}

export const SellUploadProgress: React.FC<SellUploadProgressProps> = ({
  done,
  total,
  fraction,
}) => (
  <Flex>
    <Text variant="sm" color="mono60">
      Uploading photos · {done} of {total}
    </Text>
    <ProgressBar progress={fraction * 100} />
  </Flex>
)
