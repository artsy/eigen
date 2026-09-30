import { CityGuideEventGuides_query$data } from "__generated__/CityGuideEventGuides_query.graphql"
import { GuideRow } from "app/Scenes/CityGuide/Components/CityGuideGuideListItem"
import { extractNodes } from "app/utils/extractNodes"

export const toGuideRows = (
  connection: CityGuideEventGuides_query$data["itinerariesConnection"] | undefined
): GuideRow[] =>
  extractNodes(connection)
    .filter((itinerary) => itinerary.visibility === "PUBLIC")
    .map((itinerary) => ({
      id: itinerary.internalID,
      itineraryId: itinerary.slug ?? itinerary.internalID,
      internalID: itinerary.internalID,
      slug: itinerary.slug ?? null,
      title: itinerary.title,
      subtitle: itinerary.subtitle ?? "",
      authorName: itinerary.authorName ?? "",
      imageUrl: itinerary.heroImage?.url ?? "",
      featuredImageUrl: itinerary.heroImage?.featuredUrl ?? "",
      featured: itinerary.featured,
    }))
