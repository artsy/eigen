import { Spacer, Flex, Text } from "@artsy/palette-mobile"
import { ArtQuizResultsTabsHeaderTriggerCampaignMutation } from "__generated__/ArtQuizResultsTabsHeaderTriggerCampaignMutation.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { unsafe_getUserEmail } from "app/store/GlobalStore"
import { Button } from "palette"
import { graphql, useMutation } from "react-relay"

interface ArtQuizResultsTabsHeaderProps {
  title: string
  subtitle: string
}

export const ArtQuizResultsTabsHeader = ({ title, subtitle }: ArtQuizResultsTabsHeaderProps) => {
  const currentUserEmail = unsafe_getUserEmail()
  const [submitMutation, isLoading] = useMutation<ArtQuizResultsTabsHeaderTriggerCampaignMutation>(
    TriggerCampaignButtonMutation
  )

  const handlePress = () => {
    submitMutation({
      variables: {
        input: {
          campaignID: "ART_QUIZ",
        },
      },
      onCompleted() {
        Toast.show(`Results sent to ${currentUserEmail}`, "bottom")
      },
      onError() {
        Toast.show("Something went wrong. Please try again.", "bottom")
      },
    })
  }

  return (
    <Flex px={2}>
      <Text variant="lg">{title}</Text>
      <Text variant="sm" color="black60">
        {subtitle}
      </Text>
      <Spacer y={1} />
      <Button size="small" variant="outlineGray" onPress={handlePress} loading={isLoading}>
        Email My Results
      </Button>
    </Flex>
  )
}

const TriggerCampaignButtonMutation = graphql`
  mutation ArtQuizResultsTabsHeaderTriggerCampaignMutation($input: TriggerCampaignInput!) {
    triggerCampaign(input: $input) {
      clientMutationId
    }
  }
`
