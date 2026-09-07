import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { CityEventRailCard } from "app/Scenes/CityGuide/Components/CityEventRailCard"
import { CityFairRailCard } from "app/Scenes/CityGuide/Components/CityFairRailCard"
import { FlatList } from "react-native"

/**
 * Cards bleed past the right gutter, so the rail is laid out edge to edge and the padding
 * lives on its content instead. Figma gives the Fairs frame 10 and the other two 20; the rest
 * of the screen sits at 20, so the 10 reads as a stray frame value rather than intent.
 */
const railContentStyle = { paddingHorizontal: 20 }

/** The 10pt gap the designs put between cards, applied as a separator. */
const RAIL_GAP = 10

export const CityGuideFairs: React.FC<{ cityName: string }> = ({ cityName }) => {
  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle variant="large" title={`Current ${cityName} Fairs`} onPress={() => {}} />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={fairsData}
        contentContainerStyle={railContentStyle}
        ItemSeparatorComponent={() => <Flex width={RAIL_GAP} />}
        renderItem={({ item }) => (
          <CityFairRailCard title={item.name} image={item.image} href={item.href} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Flex>
  )
}

export const CityGuideShows: React.FC<{ cityName: string }> = ({ cityName }) => {
  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle variant="large" title={`Current ${cityName} Shows`} onPress={() => {}} />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={showsData}
        contentContainerStyle={railContentStyle}
        ItemSeparatorComponent={() => <Flex width={RAIL_GAP} />}
        renderItem={({ item }) => (
          <CityEventRailCard
            title={item.name}
            image={item.image}
            href={item.href}
            meta={item.dates}
            admission={item.admission}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Flex>
  )
}

/**
 * Unlike the two "Current …" sections, this title carries no city name — the designs show a
 * plain "Opening Soon".
 */
export const CityGuideOpeningSoon: React.FC = () => {
  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle variant="large" title="Opening Soon" onPress={() => {}} />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={openingSoonData}
        contentContainerStyle={railContentStyle}
        ItemSeparatorComponent={() => <Flex width={RAIL_GAP} />}
        renderItem={({ item }) => (
          // Arched image and no admission line: the two things separating this card from a
          // Current Shows one.
          <CityEventRailCard
            title={item.name}
            image={item.image}
            href={item.href}
            meta={item.opensAt}
            archTopImage
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Flex>
  )
}

export const CityGuideEvents: React.FC<{ cityName: string }> = ({ cityName }) => {
  return (
    <Join separator={<Spacer y={2} />}>
      <CityGuideFairs cityName={cityName} />
      <CityGuideShows cityName={cityName} />
      <CityGuideOpeningSoon />
    </Join>
  )
}

/*
  Slugs are real, reused from the itinerary mocks on the city-guide-saves branch, which took
  them off artsy.net. Invented slugs render the app's not-found state: `/show/:showID` resolves
  a real Show, and a show's slug is `<partner>-<title>` rather than the title alone. A few
  titles here changed with them — the ones I had filled in from Figma's truncated mock text
  ("David Turley: House…", "Splash: Sea, Beach…") were guesses, and these are the real shows.
*/
const fairsData = [
  {
    id: 1,
    name: "Frieze London",
    href: "/fair/frieze-london-2025",
    image: "https://picsum.photos/id/1015/300/500.jpg",
  },
  {
    id: 2,
    name: "Photo London",
    href: "/fair/photo-london-2026",
    image: "https://picsum.photos/id/1016/300/500.jpg",
  },
  {
    id: 3,
    name: "London Original Print Fair",
    href: "/fair/london-original-print-fair-2026",
    image: "https://picsum.photos/id/1018/300/500.jpg",
  },
]

const showsData = [
  {
    id: 1,
    name: "One Fly Makes No Summer",
    href: "/show/kristin-hjellegjerde-gallery-one-fly-makes-no-summer",
    dates: "Jul 31 - Aug 29, 2026",
    admission: "Free",
    image: "https://picsum.photos/id/1020/300/300.jpg",
  },
  {
    id: 2,
    name: "House Plant Care",
    href: "/show/8-holland-street-david-turley-house-plant-care",
    dates: "Jul 15 - Aug 29, 2026",
    admission: "Free",
    image: "https://picsum.photos/id/1021/300/300.jpg",
  },
  {
    id: 3,
    name: "So This Is Goodbye...",
    href: "/show/beers-london-so-this-is-goodbye-dot-dot-dot",
    dates: "Aug 20 - Aug 29, 2026",
    admission: "Paid Entry",
    image: "https://picsum.photos/id/1022/300/300.jpg",
  },
  {
    id: 4,
    name: "The Language of Glaze",
    href: "/show/carpenters-workshop-gallery-the-language-of-glaze",
    dates: "Aug 1 - Aug 29, 2026",
    image: "https://picsum.photos/id/1023/300/300.jpg",
  },
  {
    id: 5,
    name: "Splash: Sea, Beach and Pool",
    href: "/show/atlas-gallery-splash-sea-beach-and-pool",
    dates: "Jun 9 - Aug 30, 2026",
    image: "https://picsum.photos/id/1024/300/300.jpg",
  },
]

const openingSoonData = [
  {
    id: 1,
    name: "Vestiges",
    href: "/show/annely-juda-fine-art-vestiges",
    opensAt: "Sep 3, 2026",
    image: "https://picsum.photos/id/1025/300/300.jpg",
  },
  {
    id: 2,
    name: "Pop Odyssey",
    href: "/show/halcyon-pop-odyssey",
    opensAt: "Sep 3, 2026",
    image: "https://picsum.photos/id/1026/300/300.jpg",
  },
  {
    id: 3,
    name: "Like Music in the Blood",
    href: "/show/thaddaeus-ropac-like-music-in-the-blood",
    opensAt: "Sep 3, 2026",
    image: "https://picsum.photos/id/1027/300/300.jpg",
  },
  {
    id: 4,
    name: "No Ruined Stones",
    href: "/show/cadogan-gallery-no-ruined-stones-richard-hearns",
    opensAt: "Sep 3, 2026",
    image: "https://picsum.photos/id/1028/300/300.jpg",
  },
  {
    id: 5,
    name: "Second Nature",
    href: "/show/open-doors-gallery-second-nature",
    opensAt: "Sep 3, 2026",
    image: "https://picsum.photos/id/1029/300/300.jpg",
  },
]
