import { Box, Separator, Spacer, Tabs, Text } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { CityGuideEventSection } from "app/Scenes/CityGuide/Components/CityGuideEventSection"
import { CityGuideFairEventSection } from "app/Scenes/CityGuide/Components/CityGuideFairEventSection"
import { CityGuideSavedEventSection } from "app/Scenes/CityGuide/Components/CityGuideSavedEventSection"
import { BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { Fragment, useMemo } from "react"
import { Platform, ViewProps } from "react-native"

interface Props extends ViewProps {
  buckets: BucketResults
  cityName: string
  citySlug: string
}

interface Section {
  type: string
  data?: any
}

const buildSections = (buckets: BucketResults, cityName: string): Section[] => {
  const sections: Section[] = []

  sections.push({
    type: "header",
    data: `${cityName} City Guide`,
  })

  if (buckets.saved) {
    sections.push({
      type: "saved",
      data: buckets.saved,
    })
  }

  if (buckets.fairs && buckets.fairs.length) {
    sections.push({
      type: "fairs",
      data: buckets.fairs,
    })
  }

  if (buckets.galleries && buckets.galleries.length) {
    sections.push({
      type: "galleries",
      data: buckets.galleries,
    })
  }

  if (buckets.museums && buckets.museums.length) {
    sections.push({
      type: "museums",
      data: buckets.museums,
    })
  }

  if (buckets.closing && buckets.closing.length) {
    sections.push({
      type: "closing",
      data: buckets.closing,
    })
  }

  if (buckets.opening && buckets.opening.length) {
    sections.push({
      type: "opening",
      data: buckets.opening,
    })
  }

  return sections
}

// @TODO: Implement test for the CityGuideAllEvents component https://artsyproduct.atlassian.net/browse/LD-562
export const CityGuideAllEvents: React.FC<Props> = ({ buckets, cityName, citySlug }) => {
  // Only recompute sections when a show's saved state changes, mirroring the previous
  // shouldComponentUpdate gating that avoided re-deriving sections on every bucket reference change.
  const followedSignature = ["saved", "closing", "museums", "opening", "closing"]
    .map((key) => JSON.stringify((buckets as any)[key]?.map((g: any) => g.is_followed)))
    .join("|")

  const sections = useMemo(
    () => buildSections(buckets, cityName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [followedSignature, cityName]
  )

  const renderItemSeparator = ({ leadingItem }: { leadingItem: Section }) => {
    if (["fairs", "saved", "header"].indexOf(leadingItem.type) === -1) {
      return (
        <Box py={1}>
          <Separator />
        </Box>
      )
    } else {
      return null
    }
  }

  const renderItem = ({ item: { data, type } }: { item: Section }) => {
    switch (type) {
      case "fairs":
        return <CityGuideFairEventSection citySlug={citySlug} data={data} />
      case "galleries":
        return (
          <CityGuideEventSection title="Gallery shows" data={data} section="galleries" citySlug={citySlug} />
        )
      case "museums":
        return (
          <CityGuideEventSection title="Museum shows" data={data} section="museums" citySlug={citySlug} />
        )
      case "opening":
        return (
          <CityGuideEventSection title="Opening soon" data={data} section="opening" citySlug={citySlug} />
        )
      case "closing":
        return (
          <CityGuideEventSection title="Closing soon" data={data} section="closing" citySlug={citySlug} />
        )
      case "saved":
        return <CityGuideSavedEventSection data={data} citySlug={citySlug} />
      case "header":
        return <Box pt={4}>{!!data && <Text variant="lg-display">{data}</Text>}</Box>
      default:
        return null
    }
  }

  // We need to wrap the flatlist with a BottomSheetScrollView on Android to allow scrolling
  // On iOS it's not required because the bottom sheet is scrollable by default
  const Wrapper = Platform.OS === "android" ? BottomSheetScrollView : Fragment

  return (
    <Wrapper>
      <Tabs.FlatList
        data={sections}
        ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={(item) => item.type}
        renderItem={(item) => renderItem(item)}
        ListFooterComponent={() => <Spacer y={4} />}
      />
    </Wrapper>
  )
}
