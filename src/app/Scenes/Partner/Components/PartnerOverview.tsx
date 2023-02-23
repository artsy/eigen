import { Spacer } from "@artsy/palette-mobile"
import { PartnerOverview_partner$data } from "__generated__/PartnerOverview_partner.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { PartnerArtistsList } from "app/Scenes/Partner/Components/PartnerArtistsList"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerLocationSectionContainer as PartnerLocationSection } from "./PartnerLocationSection"

export const PartnerOverview: React.FC<{
  partner: PartnerOverview_partner$data
}> = ({ partner }) => {
  const { profile, displayArtistsSection, cities } = partner
  const aboutText = profile?.bio

  if (!aboutText && !cities) {
    return (
      <StickyTabPageScrollView>
        <TabEmptyState text="There is no information for this gallery yet" />
      </StickyTabPageScrollView>
    )
  }

  return (
    // TODO: Switch to StickyTabPageFlatList
    <StickyTabPageScrollView>
      <Spacer y={2} />
      {!!aboutText && (
        <>
          <ReadMore content={aboutText} maxChars={300} textVariant="sm" />
          <Spacer y={2} />
        </>
      )}
      <PartnerLocationSection partner={partner} />
      {!!displayArtistsSection ? <PartnerArtistsList partner={partner} /> : null}
    </StickyTabPageScrollView>
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
      ...PartnerArtistsList_partner @include(if: $displayArtistsSection)
    }
  `,
})
