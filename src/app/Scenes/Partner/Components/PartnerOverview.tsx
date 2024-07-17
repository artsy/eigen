import { Spacer, Tabs } from "@artsy/palette-mobile"
import { PartnerOverview_partner$data } from "__generated__/PartnerOverview_partner.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { PartnerArtistsListPaginated } from "app/Scenes/Partner/Components/PartnerArtistsListPaginated"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"

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
    // TODO: fix warning about VirtualizedLists should never be nested inside plain
    // ScrollViews with the same orientation, maybe refactor to use Tabsflatlist?
    <Tabs.ScrollView>
      <Spacer y={2} />
      {!!aboutText && (
        <>
          <ReadMore content={aboutText} maxChars={300} textVariant="sm" />
          <Spacer y={2} />
        </>
      )}
      <PartnerLocationSection partner={partner} />
      {!!displayArtistsSection ? <PartnerArtistsListPaginated partner={partner} /> : null}
    </Tabs.ScrollView>
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
      ...PartnerLocationSection_partner
      ...PartnerArtistsListPaginated_partner @include(if: $displayArtistsSection)
    }
  `,
})
