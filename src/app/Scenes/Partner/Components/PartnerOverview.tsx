import { Tabs } from "@artsy/palette-mobile"
import { PartnerOverview_partner$data } from "__generated__/PartnerOverview_partner.graphql"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { PartnerOverviewList } from "app/Scenes/Partner/Components/PartnerOverviewList"
import { createFragmentContainer, graphql } from "react-relay"

export const PartnerOverview: React.FC<{
  partner: PartnerOverview_partner$data
}> = ({ partner }) => {
  const { profile, displayArtistsSection, cities } = partner
  const aboutText = profile?.bio

  if (!aboutText && !cities) {
    return (
      <Tabs.ScrollView>
        <TabEmptyState text="There is no information for this gallery yet" />
      </Tabs.ScrollView>
    )
  }

  return (
    <PartnerOverviewList
      partner={partner}
      aboutText={aboutText}
      displayArtistsSection={displayArtistsSection}
    />
  )
}

export const PartnerOverviewFragmentContainer = createFragmentContainer(PartnerOverview, {
  partner: graphql`
    fragment PartnerOverview_partner on Partner
    @argumentDefinitions(displayArtistsSection: { type: "Boolean", defaultValue: false }) {
      cities
      displayArtistsSection
      profile {
        bio
      }
      ...PartnerOverviewListPaginated_partner @include(if: $displayArtistsSection)
    }
  `,
})
