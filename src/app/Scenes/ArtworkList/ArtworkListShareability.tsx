import { Flex, LockIcon, Text } from "@artsy/palette-mobile"

export const ArtworkListShareability = ({
  shareableWithPartners,
}: {
  shareableWithPartners: boolean
}) => {
  return (
    <Flex alignItems="center" flexDirection="row" mx={2} mb={1}>
      {!shareableWithPartners && <LockIcon mr={0.5} fill="black100" />}

      <Text variant="sm-display" color="black60">
        {shareableWithPartners ? "Shared" : "Private"}
      </Text>
    </Flex>
  )
}
