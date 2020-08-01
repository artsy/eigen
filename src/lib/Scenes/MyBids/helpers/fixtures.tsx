export const LOT_STANDINGS = [
  {
    isHighestBidder: true,
    isLeadingBidder: true,
    sale: {
      liveStartAt: "2020-07-27T14:55:00+00:00",
      endAt: "2020-07-27T14:55:54+00:00",
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYxZWVhMThlZTBmZDkwMDA2MTRiMjIw",
      lotLabel: "3",
      counts: {
        bidderPositions: 1,
      },
      currentBid: {
        display: "CHF 950",
      },
      artwork: {
        slug: "leo-jansen-untitled",
        artistNames: "Leo Jansen",
        href: "/artwork/leo-jansen-untitled",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/GEShb3U9PruEueZ732WYlw/medium.jpg",
        },
      },
      sale: {
        displayTimelyAt: "live 4d ago",
      },
    },
  },
  {
    isHighestBidder: false,
    isLeadingBidder: false,
    sale: {
      liveStartAt: "2020-07-27T14:55:00+00:00",
      endAt: "2020-07-27T14:55:54+00:00",
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYxZWVhMTdlZTBmZDkwMDA2MTRiMjE4",
      lotLabel: "2",
      counts: {
        bidderPositions: 2,
      },
      currentBid: {
        display: "CHF 18,000",
      },
      artwork: {
        slug: "blazo-kovacevic-painting",
        artistNames: "Blazo Kovacevic",
        href: "/artwork/blazo-kovacevic-painting",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/NyWl4Lhcj88ImL8vUMWTLw/medium.jpg",
        },
      },
      sale: {
        displayTimelyAt: "live 4d ago",
      },
    },
  },
  {
    isHighestBidder: true,
    isLeadingBidder: true,
    sale: {
      liveStartAt: "2020-07-27T14:55:00+00:00",
      endAt: "2020-07-27T14:55:54+00:00",
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYxZWVhMTVlZTBmZDkwMDA2MTRiMjEw",
      lotLabel: "1",
      counts: {
        bidderPositions: 1,
      },
      currentBid: {
        display: "CHF 450",
      },
      artwork: {
        slug: "rodrigo-zamora-painting",
        artistNames: "Rodrigo Zamora",
        href: "/artwork/rodrigo-zamora-painting",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/bih3YROhPBXPHecFApJ4Jw/medium.jpg",
        },
      },
      sale: {
        displayTimelyAt: "live 4d ago",
      },
    },
  },
]

export const REGISTERED_SALES = [
  {
    node: {
      href: "/auction/rogallery-a-curated-summer-sale",
      endAt: "2020-08-01T17:00:00+00:00",
      liveStartAt: undefined as string | undefined,
      displayTimelyAt: "ends in 3d",
      timeZone: "America/New_York",
      name: "RoGallery: A Curated Summer Sale",
      slug: "rogallery-a-curated-summer-sale",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/gNH3Jqo7shTMj2fPuoHBRg/square.jpg",
      },
      partner: {
        name: "RoGallery Auctions",
      },
    },
  },
  {
    node: {
      href: "/auction/wright-art-plus-design-13",
      endAt: undefined as string | undefined,
      liveStartAt: "2020-07-30T16:00:00+00:00",
      displayTimelyAt: "in progress",
      timeZone: "America/Chicago",
      name: "Wright: Art + Design",
      slug: "wright-art-plus-design-13",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/oatfVx6L7sj2DSEPBtt8PQ/large_rectangle.jpg",
      },
      partner: {
        name: "Rago/Wright",
      },
    },
  },
  {
    node: {
      href: "/auction/artsy-x-capsule-auctions-collection-refresh-iii",
      endAt: "2020-07-29T16:00:00+00:00",
      liveStartAt: undefined as string | undefined,
      displayTimelyAt: "ends in 2d",
      timeZone: "America/New_York",
      name: "Artsy x Capsule Auctions: Collection Refresh III",
      slug: "artsy-x-capsule-auctions-collection-refresh-iii",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/XPuUTGDL_z7mypji_tv39Q/wide.jpg",
      },
      partner: {
        name: "Artsy x Capsule Auctions",
      },
    },
  },
  {
    node: {
      href: "/auction/heritage-urban-art-summer-skate",
      endAt: undefined as string | undefined,
      liveStartAt: "2020-08-05T15:00:00+00:00",
      displayTimelyAt: "live in 5d",
      timeZone: "America/Chicago",
      name: "Heritage: Urban Art Summer Skate",
      slug: "heritage-urban-art-summer-skate",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/JOeiPjbfKixGJbQjQHubXA/source.jpg",
      },
      partner: {
        name: "Heritage Auctions",
      },
    },
  },
  {
    node: {
      href: "/auction/longhouse-shares-benefit-auction-2020",
      endAt: "2020-07-30T21:00:00+00:00",
      liveStartAt: undefined as string | undefined,
      displayTimelyAt: "ends in 19h",
      timeZone: "America/New_York",
      name: "LongHouse Shares: Benefit Auction 2020",
      slug: "longhouse-shares-benefit-auction-2020",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/TiJguopz8SwkypYEBH1TJw/source.jpg",
      },
      partner: {
        name: "LongHouse Reserve Benefit Auction",
      },
    },
  },
]

export const PROPS = {
  upcomingLots: [...LOT_STANDINGS],
  recentlyClosedLots: [...LOT_STANDINGS],
  registeredSales: REGISTERED_SALES,
}
