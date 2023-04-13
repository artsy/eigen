import { Avatar, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { isPad } from "app/utils/hardware"
import { chunk } from "lodash"
import { Image } from "react-native"

export const PriceDatabaseBenefits: React.FC = () => {
  const isTablet = isPad()
  const { width } = useScreenDimensions()

  return (
    <Flex m={2}>
      <Text variant="lg">Get in-depth art market data</Text>
      <Text variant="xs" mb={2}>
        Browse millions of current and historical results from leading auction houses across the
        globe.
      </Text>

      <Artists />

      <Spacer y={2} />

      <Text variant="lg">Research and validate prices</Text>
      <Text variant="xs" mb={2}>
        Access the data you need to make the right decisions for your collection, whether you’re
        researching, buying, or selling.
      </Text>

      <Image
        source={require("images/price-database-1.png")}
        style={{ width: isTablet ? "100%" : width, height: isTablet ? 480 : 340 }}
        resizeMode={isTablet ? "contain" : "cover"}
      />

      <Spacer y={2} />

      <Text variant="lg">Search for free</Text>
      <Text variant="xs" mb={2}>
        The Artsy Price Database is for every collector—with no search limits, no subscriptions, and
        no obligations. A more open art world starts here.
      </Text>

      <Image
        source={require("images/price-database-2.png")}
        style={{ width: isTablet ? "100%" : width, height: isTablet ? 480 : 340 }}
        resizeMode={isTablet ? "contain" : "cover"}
      />

      <Spacer y={2} />
    </Flex>
  )
}

const Artists: React.FC = () => {
  return (
    <Flex>
      {chunk(ARTISTS, 3).map((row, index) => (
        <Flex flexDirection="row" width="100%" justifyContent="space-between" key={index} mb={2}>
          {row.map((artist) => (
            <Flex key={artist.artistName} flex={1}>
              <Artist artist={artist} />
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  )
}

const Artist: React.FC<{ artist: ArtistElement }> = ({ artist }) => {
  return (
    <Flex alignItems="center">
      <Flex mb={0.5}>
        <Avatar size="sm" src={artist?.artistThumbnail} />
      </Flex>

      <Text variant="xs">{artist?.artistName}</Text>
      <Text variant="xs" color="black60">
        {artist?.artistNationality}, {artist?.artistBirthday}
      </Text>
    </Flex>
  )
}

type ArtistElement = {
  artistBirthday: string
  artistName: string
  artistNationality: string
  artistThumbnail: string
}

const ARTISTS: ArtistElement[] = [
  {
    artistName: "Banksy",
    artistNationality: "British",
    artistBirthday: "b. 1973",
    artistThumbnail: "https://files.artsy.net/images/banksy.png",
  },
  {
    artistName: "David Shrigley",
    artistNationality: "British",
    artistBirthday: "b. 1968",
    artistThumbnail: "https://files.artsy.net/images/david_shrigley.png",
  },
  {
    artistName: "KAWS",
    artistNationality: "American",
    artistBirthday: "b. 1974",
    artistThumbnail: "https://files.artsy.net/images/kaws.png",
  },
  {
    artistName: "Eddie Martinez",
    artistNationality: "American",
    artistBirthday: "b. 1977",
    artistThumbnail: "https://files.artsy.net/images/eddie_martinez.png",
  },
  {
    artistName: "Salman Toor",
    artistNationality: "Pakistani",
    artistBirthday: "b. 1983",
    artistThumbnail: "https://files.artsy.net/images/salman_toor.png",
  },
  {
    artistName: "Oh de Laval",
    artistNationality: "Polish",
    artistBirthday: "b. 1990",
    artistThumbnail: "https://files.artsy.net/images/oh_de_laval.png",
  },
  {
    artistName: "David Hockney",
    artistNationality: "British",
    artistBirthday: "b. 1968",
    artistThumbnail: "https://files.artsy.net/images/david_hockney.png",
  },
  {
    artistName: "Erik Parker",
    artistNationality: "German",
    artistBirthday: "b. 1968",
    artistThumbnail: "https://files.artsy.net/images/erik_parker.png",
  },
  {
    artistName: "Kehinde Wiley",
    artistNationality: "American",
    artistBirthday: "b. 1977",
    artistThumbnail: "https://files.artsy.net/images/kehinde_wiley.png",
  },
]
