import { Flex, FlexProps, Text } from "@artsy/palette-mobile"
import { HomeViewSectionGeneric_section$data } from "__generated__/HomeViewSectionGeneric_section.graphql"
import { HomeViewSectionActivityQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionActivity"
import { HomeViewSectionArticlesQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionArticles"
import { HomeViewSectionArticlesCardsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionArticlesCards"
import { HomeViewSectionArtistsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionArtists"
import { HomeViewSectionArtworksQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworks"
import { HomeViewSectionAuctionResultsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionAuctionResults"
import { HomeViewSectionCardQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionCard"
import { HomeViewSectionCardsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionCards"
import { HomeViewSectionFairsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionFairs"
import { HomeViewSectionFeaturedCollectionQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionFeaturedCollection"
import { HomeViewSectionGeneric } from "app/Scenes/HomeView/Sections/HomeViewSectionGeneric"
import { HomeViewSectionHeroUnitsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionHeroUnits"
import { HomeViewSectionMarketingCollectionsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionMarketingCollections"
import { HomeViewSectionNavigationPillsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionNavigationPills"
import { HomeViewSectionSalesQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionSales"
import { HomeViewSectionShowsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionShows"
import { HomeViewSectionTasksQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionTasks"
import { HomeViewSectionViewingRoomsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionViewingRooms"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { memo } from "react"

export interface SectionProps extends FlexProps {
  section: CleanRelayFragment<HomeViewSectionGeneric_section$data>
  index: number
  refetchKey?: number
}

export interface SectionSharedProps extends FlexProps {
  index: number
  sectionID: string
  refetchKey?: number
}

export const Section: React.FC<SectionProps> = memo(({ section, ...rest }) => {
  const enableNavigationPills = useFeatureFlag("AREnableHomeViewQuickLinks")
  const { variant: quickLinksExperimentVariant } = useExperimentVariant(
    "onyx_quick-links-experiment"
  )

  if (!section.internalID) {
    if (__DEV__) {
      throw new Error("Section has no internalID")
    }
    return null
  }

  switch (section.component?.type) {
    case "FeaturedCollection":
      return (
        <HomeViewSectionFeaturedCollectionQueryRenderer sectionID={section.internalID} {...rest} />
      )
    case "ArticlesCard":
      return <HomeViewSectionArticlesCardsQueryRenderer sectionID={section.internalID} {...rest} />
  }

  switch (section.__typename) {
    case "HomeViewSectionActivity":
      return <HomeViewSectionActivityQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionArtworks":
      return <HomeViewSectionArtworksQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionCard":
      return <HomeViewSectionCardQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionCards":
      return <HomeViewSectionCardsQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionGeneric":
      return <HomeViewSectionGeneric section={section} {...rest} />
    case "HomeViewSectionArticles":
      return <HomeViewSectionArticlesQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionArtists":
      return <HomeViewSectionArtistsQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionAuctionResults":
      return <HomeViewSectionAuctionResultsQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionHeroUnits":
      return <HomeViewSectionHeroUnitsQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionFairs":
      return <HomeViewSectionFairsQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionMarketingCollections":
      return (
        <HomeViewSectionMarketingCollectionsQueryRenderer
          sectionID={section.internalID}
          {...rest}
        />
      )
    case "HomeViewSectionShows":
      return <HomeViewSectionShowsQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionViewingRooms":
      return <HomeViewSectionViewingRoomsQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionSales":
      return <HomeViewSectionSalesQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionTasks":
      return <HomeViewSectionTasksQueryRenderer sectionID={section.internalID} {...rest} />
    case "HomeViewSectionNavigationPills": {
      if (
        enableNavigationPills &&
        quickLinksExperimentVariant.enabled &&
        quickLinksExperimentVariant.name === "experiment"
      ) {
        return (
          <HomeViewSectionNavigationPillsQueryRenderer sectionID={section.internalID} {...rest} />
        )
      }

      return null
    }

    default:
      if (__DEV__) {
        return (
          <Flex p={2} backgroundColor="mono10">
            <Text>Non supported section:</Text>
            <Text color="devpurple">{section.__typename}</Text>
          </Flex>
        )
      }
      return null
  }
})
