import { CollectionArtworkPreviewTestsQueryRawResponse } from "__generated__/CollectionArtworkPreviewTestsQuery.graphql"
import { CollectionHeaderTestsQueryRawResponse } from "__generated__/CollectionHeaderTestsQuery.graphql"

export const CollectionFixture: CollectionArtworkPreviewTestsQueryRawResponse["marketingCollection"] &
  CollectionHeaderTestsQueryRawResponse["marketingCollection"] = {
  id: "top-level-id",
  title: "Street Art Now",
  headerImage: "http://imageuploadedbymarketingteam.jpg",
  image: {
    id: "another-id",
    edges: [{ node: { id: "an-id", imageUrl: "https://defaultmostmarketableartworkincollectionimage.jpg" } }],
  },
  artworks: {
    id: "some-id",
    edges: [
      {
        node: {
          id: "QXJ0d29yazpjYXJvbHluLWJyYWR5LXN0b3VyaGVhZC1hY3Jvc3MtdGhlLWxha2U=",
          slug: "carolyn-brady-stourhead-across-the-lake",
          title: "Stourhead Across the Lake",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "carolyn-brady",
              name: "Carolyn Brady",
            },
          ],
          image: {
            aspect_ratio: 1.53,
            url: "https://d32dm0rphc51dk.cloudfront.net/tH19ZfyCDocnNsKzXOZfHg/medium.jpg",
          },
          href: "/artwork/carolyn-brady-stourhead-across-the-lake",
          sale: null,
          sale_message: "$15,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1997",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpyb2JlcnQtaGFybXMtYmx1ZmYtcm9hZA==",
          slug: "robert-harms-bluff-road",
          title: "Bluff Road",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "robert-harms",
              name: "Robert Harms",
            },
          ],
          image: {
            aspect_ratio: 1,
            url: "https://d32dm0rphc51dk.cloudfront.net/xU1Y9RXzBJ0TY6G0ZvbHHw/larger.jpg",
          },
          href: "/artwork/robert-harms-bluff-road",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1998",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpqaW0tZGluZS1hbi1pbmZvcm1hbC10aWU=",
          slug: "jim-dine-an-informal-tie",
          title: "An Informal Tie",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "jim-dine",
              name: "Jim Dine",
            },
          ],
          image: {
            aspect_ratio: 0.51,
            url: "https://d32dm0rphc51dk.cloudfront.net/dBBr15AyJ13x5heIyctJIA/tall.jpg",
          },
          href: "/artwork/jim-dine-an-informal-tie",
          sale: null,
          sale_message: "$14,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1961",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpyaWNoYXJkLWRpZWJlbmtvcm4tYmx1ZS13aXRoLXJlZC0xNQ==",
          slug: "richard-diebenkorn-blue-with-red-15",
          title: "Blue with Red",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "richard-diebenkorn",
              name: "Richard Diebenkorn",
            },
          ],
          image: {
            aspect_ratio: 0.71,
            url: "https://d32dm0rphc51dk.cloudfront.net/txGh8F3S_CDBKt6QPtjIBw/larger.jpg",
          },
          href: "/artwork/richard-diebenkorn-blue-with-red-15",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1987",
        },
      },
      {
        node: {
          id: "QXJ0d29yazprYXJlbC1hcHBlbC1oYXBweS1naG9zdA==",
          slug: "karel-appel-happy-ghost",
          title: "Happy Ghost",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "karel-appel",
              name: "Karel Appel",
            },
          ],
          image: {
            aspect_ratio: 0.78,
            url: "https://d32dm0rphc51dk.cloudfront.net/SUPKae4rRR1ZWs5mc70QJg/larger.jpg",
          },
          href: "/artwork/karel-appel-happy-ghost",
          sale: null,
          sale_message: "$6,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1960",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpuZWxsLWJsYWluZS1hdWd1c3QtbGlnaHQ=",
          slug: "nell-blaine-august-light",
          title: "August Light",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "nell-blaine",
              name: "Nell Blaine",
            },
          ],
          image: {
            aspect_ratio: 1.46,
            url: "https://d32dm0rphc51dk.cloudfront.net/P_4Avd1FcPjMKJ_aJFA1WQ/medium.jpg",
          },
          href: "/artwork/nell-blaine-august-light",
          sale: null,
          sale_message: "$10,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1989",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpicnVjZS1iZWFzbGV5LXZveWFnZXI=",
          slug: "bruce-beasley-voyager",
          title: "Voyager",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "bruce-beasley",
              name: "Bruce Beasley",
            },
          ],
          image: {
            aspect_ratio: 0.71,
            url: "https://d32dm0rphc51dk.cloudfront.net/m7N4jeFJJr3FdFqU_0YDRg/medium.jpg",
          },
          href: "/artwork/bruce-beasley-voyager",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1999",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpzYW0tZnJhbmNpcy11bmRlci1ibHVlLTM=",
          slug: "sam-francis-under-blue-3",
          title: "Under Blue",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "sam-francis",
              name: "Sam Francis",
            },
          ],
          image: {
            aspect_ratio: 1.35,
            url: "https://d32dm0rphc51dk.cloudfront.net/gz2wa9iBcZKB0ut6gMED1w/larger.jpg",
          },
          href: "/artwork/sam-francis-under-blue-3",
          sale: null,
          sale_message: "$12,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1974",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpjYXJvbHluLWJyYWR5LXRhbWFyaW5k",
          slug: "carolyn-brady-tamarind",
          title: "Tamarind",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "carolyn-brady",
              name: "Carolyn Brady",
            },
          ],
          image: {
            aspect_ratio: 1.33,
            url: "https://d32dm0rphc51dk.cloudfront.net/tkm-BtRS1igRoRUx5SdOOA/larger.jpg",
          },
          href: "/artwork/carolyn-brady-tamarind",
          sale: null,
          sale_message: "$4,500",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1999",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpyb2JlcnQtbW90aGVyd2VsbC1udW1iZXItOA==",
          slug: "robert-motherwell-number-8",
          title: "Number 8",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "robert-motherwell",
              name: "Robert Motherwell",
            },
          ],
          image: {
            aspect_ratio: 0.72,
            url: "https://d32dm0rphc51dk.cloudfront.net/u-Onw4lFPIgSERW9vkizjA/larger.jpg",
          },
          href: "/artwork/robert-motherwell-number-8",
          sale: null,
          sale_message: "$6,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "2000",
        },
      },
      {
        node: {
          id: "QXJ0d29yazplbGxzd29ydGgta2VsbHktZ3JlZW4tY3VydmUtMTQ=",
          slug: "ellsworth-kelly-green-curve-14",
          title: "Green Curve",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "ellsworth-kelly",
              name: "Ellsworth Kelly",
            },
          ],
          image: {
            aspect_ratio: 0.74,
            url: "https://d32dm0rphc51dk.cloudfront.net/Cut7VPHWKBilZ5Ivj5vJIg/larger.jpg",
          },
          href: "/artwork/ellsworth-kelly-green-curve-14",
          sale: null,
          sale_message: "$10,500",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "2000",
        },
      },
      {
        node: {
          id: "QXJ0d29yazp3b2xmLWthaG4taW4taXBzd2ljaC1tYXNz",
          slug: "wolf-kahn-in-ipswich-mass",
          title: "In Ipswich, Mass",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "wolf-kahn",
              name: "Wolf Kahn",
            },
          ],
          image: {
            aspect_ratio: 1.35,
            url: "https://d32dm0rphc51dk.cloudfront.net/qY9kBnLdh2EPkPZK8VuAaA/larger.jpg",
          },
          href: "/artwork/wolf-kahn-in-ipswich-mass",
          sale: null,
          sale_message: "$9,500",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1987",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpkYXZpZC1ob2NrbmV5LW15LXBvb2wtYW5kLXRlcnJhY2UtNA==",
          slug: "david-hockney-my-pool-and-terrace-4",
          title: "My Pool & Terrace",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "david-hockney",
              name: "David Hockney",
            },
          ],
          image: {
            aspect_ratio: 1.48,
            url: "https://d32dm0rphc51dk.cloudfront.net/05rL1DSRwbn9t43xoYkiLg/larger.jpg",
          },
          href: "/artwork/david-hockney-my-pool-and-terrace-4",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1983",
        },
      },
      {
        node: {
          id: "QXJ0d29yazp3b2xmLWthaG4tb3JjaGFyZC1hdC1kdXNr",
          slug: "wolf-kahn-orchard-at-dusk",
          title: "Orchard at Dusk",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "wolf-kahn",
              name: "Wolf Kahn",
            },
          ],
          image: {
            aspect_ratio: 1.25,
            url: "https://d32dm0rphc51dk.cloudfront.net/7YGi2ogpyQW4Vl9gorV0dQ/larger.jpg",
          },
          href: "/artwork/wolf-kahn-orchard-at-dusk",
          sale: null,
          sale_message: "$8,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1989",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpoYW5zLWhvZm1hbm4tdW50aXRsZWQtMjIx",
          slug: "hans-hofmann-untitled-221",
          title: "Untitled",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "hans-hofmann",
              name: "Hans Hofmann",
            },
          ],
          image: {
            aspect_ratio: 0.82,
            url: "https://d32dm0rphc51dk.cloudfront.net/WPV9hXX5oms437ujKpPdGg/larger.jpg",
          },
          href: "/artwork/hans-hofmann-untitled-221",
          sale: null,
          sale_message: "$5,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1942",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpwb2xseS1hcGZlbGJhdW0tbG92ZS1tZS10ZW5kZXItaWk=",
          slug: "polly-apfelbaum-love-me-tender-ii",
          title: "Love Me Tender II",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "polly-apfelbaum",
              name: "Polly Apfelbaum",
            },
          ],
          image: {
            aspect_ratio: 1,
            url: "https://d32dm0rphc51dk.cloudfront.net/HPFxUT7W1lV6UwRu3PvlRQ/larger.jpg",
          },
          href: "/artwork/polly-apfelbaum-love-me-tender-ii",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpicmlkZ2V0LXJpbGV5LWJsdWUtZG9taW5hbmNl",
          slug: "bridget-riley-blue-dominance",
          title: "Blue Dominance",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "bridget-riley",
              name: "Bridget Riley",
            },
          ],
          image: {
            aspect_ratio: 0.5,
            url: "https://d32dm0rphc51dk.cloudfront.net/SvWPlpYA25k-5Kje-Lp8rg/medium.jpg",
          },
          href: "/artwork/bridget-riley-blue-dominance",
          sale: null,
          sale_message: "$15,000",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1977",
        },
      },
      {
        node: {
          id:
            "QXJ0d29yazpwYWJsby1waWNhc3NvLW1vZGVsLWNvbnRlbXBsYXRpbmctYS1ncm91cC1vZi1zY3VscHR1cmVzLW1vZGVsZS1jb250ZW1wbGFudC11bi1ncm91cGUtc2N1bHB0ZQ==",
          slug: "pablo-picasso-model-contemplating-a-group-of-sculptures-modele-contemplant-un-groupe-sculpte",
          title: "Model Contemplating a Group of Sculptures (Modele Contemplant Un Groupe Sculpte)",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "pablo-picasso",
              name: "Pablo Picasso",
            },
          ],
          image: {
            aspect_ratio: 1.21,
            url: "https://d32dm0rphc51dk.cloudfront.net/leU66mGhe0D2OvMQmGRt4Q/large_rectangle.jpg",
          },
          href: "/artwork/pablo-picasso-model-contemplating-a-group-of-sculptures-modele-contemplant-un-groupe-sculpte",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "1933",
        },
      },
      {
        node: {
          id: "QXJ0d29yazpkYWxlLWNoaWh1bHktY2VsdGljLWVtZXJhbGQtcGVyc2lhbi1wYWly",
          slug: "dale-chihuly-celtic-emerald-persian-pair",
          title: "Celtic Emerald Persian Pair",
          partner: {
            name: "Anderson Fine Art Gallery",
            id: "anderson-fine-art-gallery",
          },
          artists: [
            {
              id: "dale-chihuly",
              name: "Dale Chihuly",
            },
          ],
          image: {
            aspect_ratio: 1.5,
            url: "https://d32dm0rphc51dk.cloudfront.net/6hN0QtT-BQE2y8LGhiI3EA/medium.jpg",
          },
          href: "/artwork/dale-chihuly-celtic-emerald-persian-pair",
          sale: null,
          sale_message: "Sold",
          sale_artwork: null,
          is_biddable: false,
          is_offerable: false,
          is_acquireable: false,
          date: "",
        },
      },
    ],
  },
}
