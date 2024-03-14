import { Flex, Pill } from "@artsy/palette-mobile"
import { AlertArtworksPillsQuery } from "__generated__/AlertArtworksPillsQuery.graphql"
import { PlaceholderRaggedText } from "app/utils/placeholders"
import { FC } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface AlertArtworksPillsProps {
  alertId: string
}

export const AlertArtworksPills: FC<AlertArtworksPillsProps> = ({ alertId }) => {
  const data = useLazyLoadQuery<AlertArtworksPillsQuery>(alertArtworksPillsQuery, {
    alertId: alertId,
  })

  const pills = data.me?.alert?.pills || []

  return (
    <Flex flexDirection="row" flexWrap="wrap">
      {pills.map((pill: any) => {
        return (
          <Pill
            key={`param-${pill.field}-value-${pill.displayValue}`}
            variant="filter"
            disabled
            mr={1}
            mb={1}
          >
            {pill.displayValue}
          </Pill>
        )
      })}
    </Flex>
  )
}

const alertArtworksPillsQuery = graphql`
  query AlertArtworksPillsQuery($alertId: String!) {
    me {
      alert(id: $alertId) {
        pills: labels {
          field
          displayValue
        }
      }
    }
  }
`

export const AlertArtworksPillsPlaceholder: FC = () => {
  return (
    <Flex testID="pills-placeholder">
      <PlaceholderRaggedText numLines={2} textHeight={20} />
    </Flex>
  )
}
