const swannSale = {
  internalID: "swann",
  href: "/auction/swann-auction-galleries-lgbtq-plus-art-material-culture-and-history",
  endAt: null,
  liveStartAt: "2020-08-13T16:00:00+00:00",
  displayTimelyAt: "live in 10d",
  timeZone: "America/New_York",
  status: "open",
  name: "Swann Auction Galleries: LGBTQ+ Art, Material Culture & History",
  slug: "swann-auction-galleries-lgbtq-plus-art-material-culture-and-history",

  coverImage: {
    url: "https://d32dm0rphc51dk.cloudfront.net/1tJKlnBgHGvZSCZPlAvwAQ/wide.jpg",
  },
  partner: {
    name: "Swann Auction Galleries",
  },
}

const swannEnded = {
  ...swannSale,
  name: "Swann, but closed",
  internalID: "swann-ended",
  status: "closed",
  displayTimelyAt: "",
}

const heritageSale = {
  internalID: "heritage",
  saleType: "auction",
  href: "/auction/heritage-urban-art-summer-skate",
  endAt: "2020-08-05T15:00:00+00:00",
  status: "open",
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
}

const heritageEnded = {
  ...heritageSale,
  name: "Heritage but closed",
  internalID: "heritage-ended",
  status: "closed",
  displayTimelyAt: "",
}

export const me = {
  auctionsLotStandingConnection: {
    edges: [
      {
        // Reserve not met
        node: {
          isHighestBidder: true,
          lotState: {
            internalID: "lot-0",
            saleId: "swann",
            bidCount: 1,
            soldStatus: "ForSale",
            reserveStatus: "ReserveNotMet",
            sellingPrice: {
              displayAmount: "CHF 1,800",
            },
            askingPrice: {
              displayAmount: "CHF 2,000",
            },
          },
          saleArtwork: {
            internalID: "lot-0",
            lotLabel: "3",
            position: 3,
            artwork: {
              artistNames: "Open Swann RNM Artist",
              href: "/artwork/maskull-lasserre-painting",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
              },
            },
            sale: swannSale,
          },
        },
      },
      {
        // Winning
        node: {
          isHighestBidder: true,
          lotState: {
            internalID: "lot-1",
            bidCount: 2,
            saleId: "heritage",
            soldStatus: "ForSale",
            reserveStatus: "ReserveMet",
            sellingPrice: {
              displayAmount: "CHF 36,000",
            },
            askingPrice: {
              displayAmount: "CHF 38,000",
            },
          },

          saleArtwork: {
            internalID: "lot-1",
            lotLabel: "2",
            position: 2,
            artwork: {
              artistNames: "Open Heritage Winning Artist",
              href: "/artwork/zach-eugene-salinger-simonson-ennui",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/NtVjXx1dzUIsOfFdyW0XZw/medium.jpg",
              },
            },
            sale: heritageSale,
          },
        },
      },

      {
        // Outbid
        node: {
          isHighestBidder: false,
          lotState: {
            internalID: "lot-2",
            saleId: "swann",
            bidCount: 1,
            soldStatus: "ForSale",
            reserveStatus: "ReserveMet",
            sellingPrice: {
              displayAmount: "CHF 4,750",
            },
            askingPrice: {
              displayAmount: "CHF 5,000",
            },
          },

          saleArtwork: {
            internalID: "lot-2",
            lotLabel: "1",
            position: 1,
            artwork: {
              artistNames: "Open Swann Outbid Artist",
              href: "/artwork/leif-erik-nygards-surrealism",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/dwqgENIWYbWFU_wntBtxFg/medium.jpg",
              },
            },
            sale: swannSale,
          },
        },
      },

      // same sales but ENDED added to sale ids and a final stated added to soldStatus
      {
        // Passed
        node: {
          isHighestBidder: true,
          lotState: {
            internalID: "lot-3",
            saleId: "swann-ended",
            bidCount: 1,
            soldStatus: "Passed",
            reserveStatus: "ReserveNotMet",
            sellingPrice: {
              displayAmount: "CHF 1,800",
            },
            askingPrice: {
              displayAmount: "CHF 2,000",
            },
          },
          saleArtwork: {
            internalID: "lot-3",
            lotLabel: "3",
            position: 3,
            artwork: {
              artistNames: "Closed Swann RNM Artist",
              href: "/artwork/maskull-lasserre-painting",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
              },
            },
            sale: swannEnded,
          },
        },
      },

      {
        // Winning
        node: {
          isHighestBidder: true,
          lotState: {
            internalID: "lot-4",
            bidCount: 2,
            saleId: "heritage-ended",
            soldStatus: "Sold",
            reserveStatus: "ReserveMet",
            sellingPrice: {
              displayAmount: "CHF 36,000",
            },
            askingPrice: {
              displayAmount: "CHF 38,000",
            },
          },

          saleArtwork: {
            internalID: "lot-4",
            lotLabel: "2",
            position: 2,
            artwork: {
              artistNames: "Closed Heritage Winning Artist",
              href: "/artwork/zach-eugene-salinger-simonson-ennui",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/NtVjXx1dzUIsOfFdyW0XZw/medium.jpg",
              },
            },
            sale: heritageEnded,
          },
        },
      },

      {
        // Outbid
        node: {
          isHighestBidder: false,
          lotState: {
            internalID: "lot-5",
            saleId: "swann-ended",
            bidCount: 1,
            soldStatus: "Sold",
            reserveStatus: "ReserveMet",
            sellingPrice: {
              displayAmount: "CHF 4,750",
            },
            askingPrice: {
              displayAmount: "CHF 5,000",
            },
          },

          saleArtwork: {
            internalID: "lot-5",
            lotLabel: "1",
            position: 1,
            artwork: {
              artistNames: "Closed Swann Outbid Artist",
              href: "/artwork/leif-erik-nygards-surrealism",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/dwqgENIWYbWFU_wntBtxFg/medium.jpg",
              },
            },
            sale: swannEnded,
          },
        },
      },
    ],
  },
}

// OO Sales are online-only, others are Live Auction Integration
const [rnm, winningOO, outbid, passedClosed, winningClosedOO, outbidClosed] = me.auctionsLotStandingConnection.edges

export const lotStandings = {
  rnm,
  winningOO,
  outbid,
  passedClosed,
  winningClosedOO,
  outbidClosed,
}
