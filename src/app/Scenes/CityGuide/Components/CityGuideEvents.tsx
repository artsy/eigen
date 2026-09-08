import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { CityGuideEventsQuery } from "__generated__/CityGuideEventsQuery.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { CityEventRailCard } from "app/Scenes/CityGuide/Components/CityEventRailCard"
import {
  CityEventFairSaveControl,
  CityEventShowSaveControl,
} from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CityFairRailCard } from "app/Scenes/CityGuide/Components/CityFairRailCard"
import { CityEventSectionKey } from "app/Scenes/CityGuide/utils/cityEventSectionKey"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

/**
 * Enough to fill a rail the user can scroll a fair way, without paying for a hundred records
 * the home screen will never show. The section header leads to the full list.
 */
const RAIL_SIZE = 10

/** The 10pt gap the designs put between cards. */
const RAIL_GAP = 10

/**
 * Cards bleed past the right gutter, so the rail is laid out edge to edge and the padding
 * lives on its content instead. Figma gives the Fairs frame 10 and the other two 20; the rest
 * of the screen sits at 20, so the 10 reads as a stray frame value rather than intent.
 */
const railContentStyle = { paddingHorizontal: 20 }

interface Props {
  citySlug: string
  cityName: string
}

/** The designs show admission as words, not a boolean. Absent when the server does not know. */
const admissionLabel = (isFreeAdmission: boolean | null | undefined) => {
  if (isFreeAdmission == null) return undefined

  return isFreeAdmission ? "Free" : "Paid Entry"
}

/**
 * One section: the header and its horizontal rail. Rendered by all three sections rather
 * than repeated three times, so the "hide when empty" rule lives in one place.
 *
 * `Join` drops falsy children (`Children.toArray`), so a caller can guard this with `&&`
 * without leaving a stray separator behind.
 */
const EventRail = <T,>({
  title,
  href,
  onPress,
  data,
  keyExtractor,
  renderItem,
}: {
  title: string
  href: string
  onPress: () => void
  data: readonly T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T) => React.ReactElement
}) => {
  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle variant="large" title={title} href={href} onPress={onPress} />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        contentContainerStyle={railContentStyle}
        ItemSeparatorComponent={() => <Flex width={RAIL_GAP} />}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem(item)}
      />
    </Flex>
  )
}

const CityGuideEventsSections: React.FC<Props> = ({ citySlug, cityName }) => {
  const { trackEvent } = useTracking<Schema.Entity>()
  const data = useLazyLoadQuery<CityGuideEventsQuery>(Query, { citySlug, first: RAIL_SIZE })

  const sectionHref = (section: CityEventSectionKey) => `/city-guide/${citySlug}/events/${section}`

  const trackSectionTap = (section: CityEventSectionKey) => () => {
    trackEvent({
      action_name: Schema.ActionNames.ViewAll,
      action_type: Schema.ActionTypes.Tap,
      owner_type: Schema.OwnerEntityTypes.CityGuide,
      owner_slug: citySlug,
      context_module: section,
    })
  }

  const fairs = extractNodes(data.city?.fairsConnection)
  const currentShows = extractNodes(data.city?.currentShows)
  const openingShows = extractNodes(data.city?.openingShows)

  return (
    <Join separator={<Spacer y={2} />}>
      {/*
        A section with nothing in it is hidden entirely, header included: an empty rail under
        a "Current London Fairs" heading reads as a broken screen rather than as "no fairs".
      */}
      {!!fairs.length && (
        <EventRail
          title={`Current ${cityName} Fairs`}
          href={sectionHref("fairs")}
          onPress={trackSectionTap("fairs")}
          data={fairs}
          keyExtractor={(fair) => fair.internalID}
          renderItem={(fair) => (
            <CityFairRailCard
              title={fair.name ?? ""}
              image={fair.image?.url ?? ""}
              href={fair.href ?? ""}
              saveControl={
                // A fair is followed through its Profile, not directly. No profile, no
                // control — there is nothing to follow.
                fair.profile ? (
                  <CityEventFairSaveControl
                    id={fair.profile.id}
                    internalID={fair.profile.internalID}
                    isFollowed={fair.profile.isFollowed}
                    name={fair.name ?? ""}
                  />
                ) : null
              }
            />
          )}
        />
      )}

      {!!currentShows.length && (
        <EventRail
          title={`Current ${cityName} Shows`}
          href={sectionHref("shows")}
          onPress={trackSectionTap("shows")}
          data={currentShows}
          keyExtractor={(show) => show.internalID}
          renderItem={(show) => (
            <CityEventRailCard
              title={show.name ?? ""}
              image={show.coverImage?.url ?? ""}
              href={show.href ?? ""}
              meta={show.exhibitionPeriod ?? ""}
              admission={admissionLabel(show.isFreeAdmission)}
              saveControl={
                <CityEventShowSaveControl
                  id={show.id}
                  internalID={show.internalID}
                  isFollowed={show.isFollowed}
                  name={show.name ?? ""}
                />
              }
            />
          )}
        />
      )}

      {/*
        Unlike the two "Current …" sections, this title carries no city name — the designs
        show a plain "Opening Soon".
      */}
      {!!openingShows.length && (
        <EventRail
          title="Opening Soon"
          href={sectionHref("opening")}
          onPress={trackSectionTap("opening")}
          data={openingShows}
          keyExtractor={(show) => show.internalID}
          renderItem={(show) => (
            // Arched image and no admission line: the two things separating this card from
            // a Current Shows one. The date is the opening day rather than a run, which is
            // what the section is about.
            <CityEventRailCard
              title={show.name ?? ""}
              image={show.coverImage?.url ?? ""}
              href={show.href ?? ""}
              meta={show.opensAt ?? ""}
              archTopImage
              saveControl={
                <CityEventShowSaveControl
                  id={show.id}
                  internalID={show.internalID}
                  isFollowed={show.isFollowed}
                  name={show.name ?? ""}
                />
              }
            />
          )}
        />
      )}
    </Join>
  )
}

/**
 * `status: RUNNING` rather than `CURRENT`, which would overlap `UPCOMING` and put the same
 * show under both Current Shows and Opening Soon.
 *
 * Opening Soon takes a single formatted `startAt` rather than `exhibitionPeriod`: the section
 * is about when a show opens, and the designs show one date. Formatting stays on the server,
 * through Metaphysics' own `format` argument.
 */
const Query = graphql`
  query CityGuideEventsQuery($citySlug: String!, $first: Int!) {
    city(slug: $citySlug) {
      fairsConnection(first: $first, status: RUNNING, sort: START_AT_ASC) {
        edges {
          node {
            internalID
            name
            href
            image {
              url
            }
            profile {
              id
              internalID
              isFollowed
            }
          }
        }
      }

      currentShows: showsConnection(
        first: $first
        status: RUNNING
        sort: START_AT_ASC
        includeStubShows: false
      ) {
        edges {
          node {
            id
            internalID
            name
            href
            isFollowed
            exhibitionPeriod
            isFreeAdmission
            coverImage {
              url
            }
          }
        }
      }

      openingShows: showsConnection(
        first: $first
        status: UPCOMING
        dayThreshold: 14
        sort: START_AT_ASC
      ) {
        edges {
          node {
            id
            internalID
            name
            href
            isFollowed
            opensAt: startAt(format: "MMM D, YYYY")
            coverImage {
              url
            }
          }
        }
      }
    }
  }
`

export const CityGuideEvents = withSuspense({
  Component: CityGuideEventsSections,
  // The sections sit mid-scroll on the home screen, so they stay absent until they have
  // data rather than reserving space and shifting everything below.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
