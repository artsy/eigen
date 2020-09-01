export const me = {
  auctionsLotStandingConnection: {
    edges: [
      {
        // Reserve not met
        node: {
          isHighestBidder: true,
          lotState: {
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
            id: "U2FsZUFydHdvcms6NWYyODM2MzRmOTc5N2UwMDA3ZGM1MDU1",
            lotLabel: "3",
            artwork: {
              artistNames: "Maskull Lasserre",
              href: "/artwork/maskull-lasserre-painting",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
              },
            },
            sale: {
              internalID: "swann",
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
        },
      },

      {
        // Winning
        node: {
          isHighestBidder: true,
          lotState: {
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
            id: "U2FsZUFydHdvcms6NWYyODM2MzNmOTc5N2UwMDA3ZGM1MDRk",
            lotLabel: "2",
            artwork: {
              artistNames: "Zach Eugene Salinger-Simonson",
              href: "/artwork/zach-eugene-salinger-simonson-ennui",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/NtVjXx1dzUIsOfFdyW0XZw/medium.jpg",
              },
            },
            sale: {
              internalID: "heritage",
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
        },
      },
      {
        // Outbid
        node: {
          isHighestBidder: false,
          lotState: {
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
            id: "U2FsZUFydHdvcms6NWYyODM2MzFmOTc5N2UwMDA3ZGM1MDQ1",
            lotLabel: "1",
            artwork: {
              artistNames: "Leif Erik Nygards",
              href: "/artwork/leif-erik-nygards-surrealism",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/dwqgENIWYbWFU_wntBtxFg/medium.jpg",
              },
            },
            sale: {
              internalID: "swann",
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
        },
      },

      // same sales but ENDED added to sale ids and a final stated added to soldStatus
      {
        // Reserve not met
        node: {
          isHighestBidder: true,
          lotState: {
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
            id: "U2FsZUFydHdvcms6NWYyODM2MzRmOTc5N2UwMDA3ZGM1MDU1",
            lotLabel: "3",
            artwork: {
              artistNames: "Maskull Lasserre",
              href: "/artwork/maskull-lasserre-painting",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
              },
            },
            sale: {
              displayTimelyAt: "Closed on 7/15/20",
            },
          },
        },
      },
      {
        // Winning
        node: {
          isHighestBidder: true,
          lotState: {
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
            id: "U2FsZUFydHdvcms6NWYyODM2MzNmOTc5N2UwMDA3ZGM1MDRk",
            lotLabel: "2",
            artwork: {
              artistNames: "Zach Eugene Salinger-Simonson",
              href: "/artwork/zach-eugene-salinger-simonson-ennui",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/NtVjXx1dzUIsOfFdyW0XZw/medium.jpg",
              },
              sale: {
                displayTimelyAt: "Closed on 7/12/20",
              },
            },
          },
        },
      },
      {
        // Outbid
        node: {
          isHighestBidder: false,
          lotState: {
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
            id: "U2FsZUFydHdvcms6NWYyODM2MzFmOTc5N2UwMDA3ZGM1MDQ1",
            lotLabel: "1",
            artwork: {
              artistNames: "Leif Erik Nygards",
              href: "/artwork/leif-erik-nygards-surrealism",
              image: {
                url: "https://d2v80f5yrouhh2.cloudfront.net/dwqgENIWYbWFU_wntBtxFg/medium.jpg",
              },
            },
            sale: {
              displayTimelyAt: "Closed on 7/15/20",
            },
          },
        },
      },
    ],
  },
}
