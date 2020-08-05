export const sales = {
  edges: [
    {
      node: {
        saleType: "auction",
        href: "/auction/swann-auction-galleries-lgbtq-plus-art-material-culture-and-history",
        endAt: null,
        liveStartAt: "2020-08-13T16:00:00+00:00",
        displayTimelyAt: "live in 10d",
        timeZone: "America/New_York",
        name: "Swann Auction Galleries: LGBTQ+ Art, Material Culture & History",
        slug: "swann-auction-galleries-lgbtq-plus-art-material-culture-and-history",
        coverImage: {
          url: "https://d32dm0rphc51dk.cloudfront.net/1tJKlnBgHGvZSCZPlAvwAQ/wide.jpg",
        },
        partner: {
          name: "Swann Auction Galleries",
        },
      },
    },
    {
      node: {
        saleType: "auction",
        href: "/auction/heritage-urban-art-summer-skate",
        endAt: null,
        liveStartAt: "2020-08-05T15:00:00+00:00",
        displayTimelyAt: "live in 2d",
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
  ],
}

export const lotStandings = [
  {
    // Reserve not met
    isHighestBidder: false,
    isLeadingBidder: true,
    sale: {
      displayTimelyAt: "in progress",
      liveStartAt: "2020-08-03T19:10:10+00:00",
      endAt: null,
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYyODM2MzRmOTc5N2UwMDA3ZGM1MDU1",
      lotLabel: "3",
      counts: {
        bidderPositions: 1,
      },
      currentBid: {
        display: "CHF 1,800",
      },
      artwork: {
        artistNames: "Maskull Lasserre",
        href: "/artwork/maskull-lasserre-painting",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
        },
      },
    },
  },
  {
    // Winning
    isHighestBidder: true,
    isLeadingBidder: true,
    sale: {
      displayTimelyAt: "in progress",
      liveStartAt: "2020-08-03T19:10:10+00:00",
      endAt: null,
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYyODM2MzNmOTc5N2UwMDA3ZGM1MDRk",
      lotLabel: "2",
      counts: {
        bidderPositions: 2,
      },
      currentBid: {
        display: "CHF 36,000",
      },
      artwork: {
        artistNames: "Zach Eugene Salinger-Simonson",
        href: "/artwork/zach-eugene-salinger-simonson-ennui",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/NtVjXx1dzUIsOfFdyW0XZw/medium.jpg",
        },
      },
    },
  },
  {
    // Outbid
    isHighestBidder: false,
    isLeadingBidder: false,
    sale: {
      displayTimelyAt: "in progress",
      liveStartAt: "2020-08-03T19:10:10+00:00",
      endAt: null,
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYyODM2MzFmOTc5N2UwMDA3ZGM1MDQ1",
      lotLabel: "1",
      counts: {
        bidderPositions: 2,
      },
      currentBid: {
        display: "CHF 4,750",
      },
      artwork: {
        artistNames: "Leif Erik Nygards",
        href: "/artwork/leif-erik-nygards-surrealism",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/dwqgENIWYbWFU_wntBtxFg/medium.jpg",
        },
      },
    },
  },
]
