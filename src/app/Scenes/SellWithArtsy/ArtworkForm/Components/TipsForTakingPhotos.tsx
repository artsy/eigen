import { Flex, Spacer, Text, Box, Join } from "@artsy/palette-mobile"
import { ScrollView } from "react-native"

export const TipsForTakingPhotos: React.FC<{}> = () => {
  return (
    <Flex flex={1} px={2}>
      <ScrollView>
        <Text variant="lg-display" mb={4}>
          Three tips to improve your chances of selling
        </Text>
        <Join separator={<Spacer y={4} />}>
          <>
            <Box height={160} width={160} backgroundColor="red10" mb={1} />
            <Text>Upload high-quality photos of the work’s front and back.</Text>
          </>
          <>
            <Box height={160} width={160} backgroundColor="red10" mb={1} />
            <Text>
              Include signatures, edition numbers or close-up details to give confidence to buyer.
            </Text>
          </>
          <>
            <Box height={160} width={160} backgroundColor="red10" mb={1} />
            <Text>
              Add framed images or the artwork in context so the buyer can visualise the artwor.
            </Text>
          </>
        </Join>
      </ScrollView>
    </Flex>
  )
}
