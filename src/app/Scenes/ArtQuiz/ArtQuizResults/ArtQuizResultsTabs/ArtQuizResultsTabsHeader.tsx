import { Spacer, Flex, Text, CloseIcon } from "@artsy/palette-mobile"
import { ArtQuizResultsTabsHeaderTriggerCampaignMutation } from "__generated__/ArtQuizResultsTabsHeaderTriggerCampaignMutation.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { unsafe_getUserEmail } from "app/store/GlobalStore"
import { Button, Touchable } from "palette"
import { graphql, useMutation } from "react-relay"

interface ArtQuizResultsTabsHeaderProps {
  title: string
  subtitle: string
}

export const ArtQuizResultsTabsHeader = ({ title, subtitle }: ArtQuizResultsTabsHeaderProps) => {
  const { onDone } = useOnboardingContext()
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
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text variant="lg">{title}</Text>
        <Touchable onPress={onDone}>
          <CloseIcon />
        </Touchable>
      </Flex>
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
