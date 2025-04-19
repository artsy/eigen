import { Spacer, Flex, Text, Button } from "@artsy/palette-mobile"
import { ArtQuizResultsTabsHeaderTriggerCampaignMutation } from "__generated__/ArtQuizResultsTabsHeaderTriggerCampaignMutation.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { unsafe_getUserEmail } from "app/store/GlobalStore"
import { graphql, useMutation } from "react-relay"

interface ArtQuizResultsTabsHeaderProps {
  subtitle: string
}

export const ArtQuizResultsTabsHeader = ({ subtitle }: ArtQuizResultsTabsHeaderProps) => {
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
      <Text variant="sm" color="mono60">
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
