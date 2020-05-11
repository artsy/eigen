import { Box, color, Flex, Join, Sans, Spacer } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { chunk } from "lodash"
import React, { useRef } from "react"
import { FlatList, TouchableHighlight } from "react-native"

export const ArtistList = () => {
  const data = fakeData()
  const chunksOfArtists = chunk(data.artists, 3)

  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <Spacer mr={3} />}
      data={chunksOfArtists}
      initialNumToRender={2}
      renderItem={({ item }) => <StackOfArtists artists={item} />}
      keyExtractor={(_item, index) => String(index)}
    />
  )
}

const StackOfArtists: React.FC<{ artists: Artist[] }> = ({ artists }) => {
  return (
    <Flex>
      <Join separator={<Spacer mb={2} />}>
        {artists.map(artist => {
          return <ArtistItem artist={artist} key={artist.name} />
        })}
      </Join>
    </Flex>
  )
}

const ArtistItem: React.FC<{ artist: Artist }> = ({ artist }) => {
  const navRef = useRef<any>()
  const imageUrl = artist.image?.cropped?.url
  const aspectRatio = artist.image?.cropped?.width / (artist.image?.cropped?.height || 1)

  const handlePress = () => {
    SwitchBoard.presentNavigationViewController(navRef.current, artist.href)
  }

  return (
    <TouchableHighlight underlayColor={color("white100")} activeOpacity={0.8} onPress={handlePress} ref={navRef}>
      <Flex flexDirection="row" alignItems="center" width="300">
        <Box width={76} height={70} mr={1}>
          {imageUrl && <OpaqueImageView aspectRatio={aspectRatio} imageURL={imageUrl} useRawURL />}
        </Box>
        <Sans size="4">{artist.name}</Sans>
      </Flex>
    </TouchableHighlight>
  )
}

// NOTE: anything below here will be gone once we hook this component up to Relay

interface Artist {
  name: string
  href: string
  image: {
    cropped: {
      url: string
      width: number
      height: number
    }
  }
}

interface Data {
  artists: Artist[]
}

function fakeData(): Data {
  return {
    artists: [
      {
        name: "Alex Katz",
        href: "/artist/alex-katz",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FbrHdWfNxoereaVk2VOneuw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Banksy",
        href: "/artist/banksy",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FX9vVvod7QY73ZwLDSZzljw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Katherine Bernhardt",
        href: "/artist/katherine-bernhardt",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FdAf2ClwBT2EElifyIe5Y0w%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "KAWS",
        href: "/artist/kaws",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FWhacjFyMKlMkNVzncPjlRA%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Kehinde Wiley",
        href: "/artist/kehinde-wiley",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FoO0QjJLCJYbXN42muMneDw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Mr. Brainwash",
        href: "/artist/mr-brainwash",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FNep0duc-gEOgivQ8brPi1w%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Nina Chanel Abney",
        href: "/artist/nina-chanel-abney",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FhLGj05r8UmxdJYa_dOfavQ%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Roy Lichtenstein",
        href: "/artist/roy-lichtenstein",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2For9oKva9F7V4VjrUKKx2iA%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Sterling Ruby",
        href: "/artist/sterling-ruby",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F24xpzH8QB9mQxfgOFByGEg%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Stik",
        href: "/artist/stik",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FTIDvW9dgHpVQ2QlIwJvP5w%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Takashi Murakami",
        href: "/artist/takashi-murakami",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fsp9t9kQOvTpK8s0MZC0rZQ%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Tomoo Gokita",
        href: "/artist/tomoo-gokita",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FjSojxyfsY2eR5tGgWPJybg%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Damien Hirst",
        href: "/artist/damien-hirst",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FTLj5ypujA8_sBmcjWw6cRw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "David Hockney",
        href: "/artist/david-hockney",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FkCJVZo7bcqVrjnQ22QHhvg%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "David Shrigley",
        href: "/artist/david-shrigley",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F08eAndlLlI6w8UEi0mf8Kw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Ed Ruscha",
        href: "/artist/ed-ruscha",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FNPWr9SNrvpHrluQKVIGHxA%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Eddie Martinez",
        href: "/artist/eddie-martinez",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fy794SO0hZELi9DAPSgcphQ%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Genieve Figgis",
        href: "/artist/genieve-figgis",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FST_wHhvt2K320Rac0ydEbw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Harland Miller",
        href: "/artist/harland-miller",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FRjki4rXR5GrFB1tzSxjglw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
      {
        name: "Invader",
        href: "/artist/invader",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=76&height=70&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3LcAUXIfPyMxzd_eDmJkPw%2Flarge.jpg",
            width: 76,
            height: 70,
          },
        },
      },
    ],
  }
}
