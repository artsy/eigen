import { Box, Text } from "@artsy/palette-mobile"
import { CaretButton } from "app/Components/Buttons/CaretButton"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { FairEventSectionCard } from "./Components/FairEventSectionCard"

interface Props {
  citySlug: string
  // Likely Fair[]
  data: any[]
}

export const FairEventSection: React.FC<Props> = ({ citySlug, data }) => {
  const viewAllPressed = () => {
    navigate(`/city-fair/${citySlug}`)
  }

  const fairsWithImage = data.filter((fair) => Boolean(fair.image))

  return (
    <Box backgroundColor="mono100" mb={1}>
      <Box mt={4}>
        <Text variant="lg-display" color="mono0">
          Fairs
        </Text>
      </Box>

      {fairsWithImage.map((fair) => (
        <Box key={fair.id} pr={1}>
          <FairEventSectionCard fair={fair} />
        </Box>
      ))}

      {data.length > 2 && (
        <Box mb={4}>
          <CaretButton
            onPress={() => viewAllPressed()}
            text={`View all ${data.length} fairs`}
            textColor="mono0"
          />
        </Box>
      )}
    </Box>
  )
}
