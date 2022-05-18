import { OwnerType } from "@artsy/cohesion"
import { SalesQuery, SalesQueryResponse } from "__generated__/SalesQuery.graphql"
import { LotsByFollowedArtistsRailContainer } from "app/Components/LotsByArtistsYouFollowRail/LotsByFollowedArtistsRail"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import {
  PlaceholderBox,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { Flex, Separator, Spacer, useSpace } from "palette"
import React, { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { CurrentLiveAuctions } from "./AuctionTabs/CurrentLiveAuctions"
import { UpcomingAuctions } from "./AuctionTabs/UpcomingAuctions"

export enum AuctionsTab {
  current = "Current",
  upcoming = "Upcoming",
}

export const Sales: React.FC<{ data: SalesQueryResponse }> = ({ data }) => {
  return (
    <StickyTabPage
      disableBackButtonUpdate
      tabs={[
        {
          title: AuctionsTab.current,
          content: <CurrentLiveAuctions sales={data.currentLiveAuctions} />,
          initial: true,
        },
        {
          title: AuctionsTab.upcoming,
          content: <UpcomingAuctions sales={data.upcomingAuctions} />,
          initial: false,
        },
      ]}
      staticHeaderContent={
        <PageWithSimpleHeader title="Auctions">
          {!!data.me && (
            <Flex my={1}>
              <LotsByFollowedArtistsRailContainer title="Lots by Artists You Follow" me={data.me} />
            </Flex>
          )}
        </PageWithSimpleHeader>
      }
    />
  )
}

export const SalesScreenQuery = graphql`
  query SalesQuery {
    currentLiveAuctions: viewer {
      ...CurrentLiveAuctions_viewer
    }
    upcomingAuctions: viewer {
      ...UpcomingAuctions_viewer
    }
    me {
      ...LotsByFollowedArtistsRail_me
    }
  }
`

export const SalesQueryRenderer = () => {
  const data = useLazyLoadQuery<SalesQuery>(SalesScreenQuery, {})
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.auctions })}
    >
      <Suspense
        fallback={
          <ProvidePlaceholderContext>
            <SalesPlaceHolder numberOfColumns={2} />
          </ProvidePlaceholderContext>
        }
      >
        <Sales data={data} />
      </Suspense>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const SalesPlaceHolder: React.FC<{ numberOfColumns: number }> = ({ numberOfColumns }) => {
  const screenWidth = useScreenDimensions().width
  const space = useSpace()

  const maxWidth = numberOfColumns > 0 ? screenWidth / numberOfColumns - space(2) : 0
  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between">
        <Spacer />
        <PlaceholderText width={70} margin={20} />
        <Spacer />
      </Flex>

      <Separator />

      <Spacer mb={2} mt={1} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width="40%" height={22} />
        <PlaceholderText width="40%" height={22} />
      </Flex>
      <Spacer mb={1} />
      <Separator />
      <Spacer mb={1} mt={0.5} />
      <Flex width="100%">
        {times(10).map((i) => (
          <Flex key={i} my={0.5} flexDirection="row" justifyContent="space-between" mx={2}>
            <Flex>
              <PlaceholderBox width={maxWidth - 10} height={maxWidth} marginBottom={10} />
              <RandomWidthPlaceholderText minWidth={80} maxWidth={maxWidth - 20} />
              <RandomWidthPlaceholderText minWidth={100} maxWidth={maxWidth - 20} />
              <RandomWidthPlaceholderText minWidth={100} maxWidth={maxWidth - 20} />
            </Flex>
            <Flex>
              <PlaceholderBox width={maxWidth - 10} height={maxWidth} marginBottom={10} />
              <RandomWidthPlaceholderText minWidth={80} maxWidth={maxWidth - 20} />
              <RandomWidthPlaceholderText minWidth={100} maxWidth={maxWidth - 20} />
              <RandomWidthPlaceholderText minWidth={100} maxWidth={maxWidth - 20} />
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
