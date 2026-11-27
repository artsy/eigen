import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ToggledAccordion } from "@artsy/cohesion/dist/Schema/Events/UserExperienceInteractions"
import { Flex, Text } from "@artsy/palette-mobile"
import {
  ArtistHighlightsAndAchievements_artist$data,
  ArtistHighlightsAndAchievements_artist$key,
} from "__generated__/ArtistHighlightsAndAchievements_artist.graphql"
import { ArtistCVLink } from "app/Components/Artist/ArtistAbout/ArtistCVLink"
import { Expandable } from "app/Components/Expandable"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { compact, partition } from "lodash"
import React, { useMemo } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const MAX_INSIGHT_ITEMS = 6

type Insight = ArtistHighlightsAndAchievements_artist$data["insights"][number]

const INSTITUTION_INSIGHT_KINDS: Insight["kind"][] = [
  "SOLO_SHOW",
  "GROUP_SHOW",
  "BIENNIAL",
  "COLLECTED",
  "PRIVATE_COLLECTIONS",
]

interface AchievementItem {
  title: string
  subtitle?: string
}

interface ArtistHighlightsAndAchievementsProps {
  artist: ArtistHighlightsAndAchievements_artist$key
}

export const ArtistHighlightsAndAchievements: React.FC<ArtistHighlightsAndAchievementsProps> = ({
  artist,
}) => {
  const data = useFragment(fragment, artist)
  const { trackEvent } = useTracking()

  const accordions = useMemo(() => {
    const [institutions, recognition] = partition(
      data.insights,
      ({ kind }) => !!kind && INSTITUTION_INSIGHT_KINDS.includes(kind)
    )

    return [
      {
        id: "shows",
        title: "Shows",
        items: extractNodes(data.soloShows).map<AchievementItem>((show) => ({
          title: show.name ?? "",
          subtitle: compact([
            compact([show.partner?.name, show.city]).join(", "),
            show.startYear,
          ]).join(" · "),
        })),
      },
      {
        id: "group-exhibitions-and-institutions",
        title: "Group exhibitions & institutions",
        items: toInsightItems(institutions),
      },
      {
        id: "fair-presentations",
        title: "Recent fair presentations",
        items: extractNodes(data.fairBooths).map<AchievementItem>((booth) => ({
          title: booth.fair?.name ?? booth.name ?? "",
          subtitle: compact([
            booth.partner?.name && `With ${booth.partner.name}`,
            booth.exhibitionPeriod,
          ]).join(" · "),
        })),
      },
      {
        id: "recognition",
        title: "Recognition",
        items: toInsightItems(recognition),
      },
    ].filter(({ items }) => items.length > 0)
  }, [data.soloShows, data.fairBooths, data.insights])

  if (accordions.length === 0) {
    return null
  }

  return (
    <Flex px={2}>
      <SectionTitle title="Highlights and Achievements" capitalized={false} mb={1} />

      {accordions.map(({ id, title, items }) => (
        <Expandable
          label={title}
          key={id}
          onTrack={(expand) => trackEvent(tracks.toggledAccordion(id, expand))}
        >
          <Flex my={1} gap={1}>
            {items.map((item, index) => (
              <Flex key={`${id}-${index}`}>
                <Text variant="sm">{item.title}</Text>
                {!!item.subtitle && (
                  <Text variant="xs" color="mono60">
                    {item.subtitle}
                  </Text>
                )}
              </Flex>
            ))}
          </Flex>
        </Expandable>
      ))}

      <Flex mt={2}>
        <ArtistCVLink
          artistID={data.internalID}
          artistSlug={data.slug}
          contextModule={ContextModule.artistAchievements}
        >
          See all past shows and fair booths
        </ArtistCVLink>
      </Flex>
    </Flex>
  )
}

// One item per named entity, as on web; an insight without entities is listed by its label.
const toInsightItems = (insights: Insight[]) =>
  insights
    .flatMap<AchievementItem>(({ entities, label }) =>
      entities.length > 0
        ? entities.map((entity) => ({ title: entity, subtitle: label }))
        : [{ title: label }]
    )
    .slice(0, MAX_INSIGHT_ITEMS)

const tracks = {
  toggledAccordion: (subject: string, expand: boolean): ToggledAccordion => ({
    action: ActionType.toggledAccordion,
    context_module: ContextModule.artistAchievements,
    context_owner_type: OwnerType.artistAbout,
    subject,
    expand,
  }),
}

const fragment = graphql`
  fragment ArtistHighlightsAndAchievements_artist on Artist {
    internalID
    slug
    insights(excludeBlanks: true) {
      entities
      kind
      label
    }
    soloShows: showsConnection(
      first: 6
      sort: START_AT_DESC
      atAFair: false
      soloShow: true
      isReference: true
      visibleToPublic: false
    ) {
      edges {
        node {
          name
          city
          startYear: startAt(format: "YYYY")
          partner {
            ... on Partner {
              name
            }
            ... on ExternalPartner {
              name
            }
          }
        }
      }
    }
    fairBooths: showsConnection(
      first: 5
      sort: START_AT_DESC
      atAFair: true
      isReference: true
      visibleToPublic: false
    ) {
      edges {
        node {
          name
          exhibitionPeriod(format: SHORT)
          fair {
            name
          }
          partner {
            ... on Partner {
              name
            }
            ... on ExternalPartner {
              name
            }
          }
        }
      }
    }
  }
`
