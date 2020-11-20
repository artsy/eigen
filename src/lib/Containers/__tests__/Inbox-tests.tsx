import { InboxTestsQuery } from "__generated__/InboxTestsQuery.graphql"
import { press } from "lib/Scenes/Artwork/Components/CommercialButtons/__tests__/helpers"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { RelayMockEnvironment } from "lib/tests/mockEnvironmentPayload"
import { renderWithLayout } from "lib/tests/renderWithLayout"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { Environment } from "relay-runtime"
import { MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { createMockEnvironment } from "relay-test-utils/lib/RelayModernMockEnvironment"
import { Inbox as ActualInbox, InboxContainer } from "../Inbox"

jest.unmock("react-relay")

jest.mock("lib/Scenes/Inbox/Components/Conversations/Conversations", () => ({
  ConversationsContainer: () => "Conversations",
}))

let env: RelayMockEnvironment

const getWrapper = (mockResolvers: MockResolvers = {}) => {
  env = createMockEnvironment()

  const TestRenderer = () => (
    <QueryRenderer<InboxTestsQuery>
      environment={env}
      variables={{}}
      query={graphql`
        query InboxTestsQuery @relay_test_operation {
          me {
            ...Inbox_me
            ...MyBids_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props) {
          return <InboxContainer me={props!.me!} isVisible={true} />
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )

  const wrapper = renderWithWrappers(<TestRenderer />)

  env.mock.resolveMostRecentOperation((operation) => {
    return MockPayloadGenerator.generate(operation, mockResolvers)
  })

  // wrapper.update(wrapper)

  return wrapper
}

const emptyMeProps = {
  lot_standings: [],
  conversations_existence_check: null,
}

it("Shows a zero state when there are no bids/conversations", () => {
  const tree = getWrapper({ Me: () => emptyMeProps })
  expect(extractText(tree.root)).toContain("Buying art on Artsy is simple")
})

it("renders without throwing an error", () => {
  getWrapper({ Me: () => meProps() })
})

fit("renders bids tab by default when bids are enabled", () => {
  __appStoreTestUtils__?.injectEmissionOptions({ AROptionsBidManagement: true })
  const tree = getWrapper({ Me: () => meProps() })
  expect(extractText(tree.root)).toContain("Untitled (Flag 2), 2017")
})

it("renders inquiries tab when inquiries tab is selected", async () => {
  __appStoreTestUtils__?.injectEmissionOptions({ AROptionsBidManagement: true })
  // const tree = getWrapper({ Me: () => ({ conversations: { edges: [{ node: { to: { name: "ACA Galleries" } } }] } }) })
  const tree = getWrapper({ Me: () => meProps() })
  // const inquiriesTab = tree.root.findAllByType(Text)[1]
  // console.log("INQUIREIS TAB", extractText(inquiriesTab))

  await press(tree.root, { text: "Inquiries", componentType: Text })

  // env.mock.resolveMostRecentOperation((operation) => {
  //   return MockPayloadGenerator.generate(operation, {
  //     Me: () => ({ conversations: { edges: [{ node: { to: { name: "ACA Galleries" } } }] } }),
  //   })
  // })
  // inquiriesTab.props.onPress()
  expect(extractText(tree.root)).toContain("ACA Galleries")
})

it("requests a relay refetch when fetchData is called in ZeroState", () => {
  const relayEmptyProps = {
    me: emptyMeProps,
    isVisible: true,
    relay: {
      // @ts-ignore STRICTNESS_MIGRATION
      environment: null as Environment,
      refetch: jest.fn(),
    },
  }

  const inbox = new ActualInbox(relayEmptyProps as any)
  inbox.setState = jest.fn()

  inbox.fetchData()
  expect(relayEmptyProps.relay.refetch).toBeCalled()
})

const meProps = (withBids: boolean = true, withMessages: boolean = true) => {
  const conversations = withMessages
    ? {
        edges: [
          {
            node: {
              id: "582",
              inquiry_id: "59302144275b244a81d0f9c6",
              from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
              to: { name: "ACA Galleries" },
              last_message: "Karl and Anna... Fab!",
              created_at: "2017-06-01T14:14:35.538Z",
              items: [
                {
                  title: "Karl and Anna Face Off (Diptych)",
                  item: {
                    __typename: "Artwork",
                    title: "Karl and Anna Face Off (Diptych)",
                    id: "bradley-theodore-karl-and-anna-face-off-diptych",
                    href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
                    date: "2016",
                    artist_names: "Bradley Theodore",
                    image: {
                      url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
                      image_url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/:version.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            node: {
              id: "581",
              inquiry_id: "593020be8b3b814f9f86f2fd",
              from: { name: "Jean-Luc Collecteur", email: "luc+messaging@artsymail.com" },
              to: { name: "David Krut Projects" },
              last_message:
                "Hi, I’m interested in purchasing this work. \
                    Could you please provide more information about the piece?",
              created_at: "2017-06-01T14:12:19.155Z",
              items: [
                {
                  title: "Darkness Give Way to Light",
                  item: {
                    __typename: "Artwork",
                    id: "aida-muluneh-darkness-give-way-to-light-1",
                    href: "/artwork/aida-muluneh-darkness-give-way-to-light-1",
                    title: "Darkness Give Way to Light",
                    date: "2016",
                    artist_names: "Aida Muluneh",
                    image: {
                      url: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/normalized.jpg",
                      image_url: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/:version.jpg",
                    },
                  },
                },
              ],
            },
          },
        ],
      }
    : { edges: [] }

  const lotStandings = withBids
    ? [
        {
          most_recent_bid: {
            gravityID: "594934048b3b8174796e285a",
            id: "594934048b3b8174796e285a",
            display_max_bid_amount_dollars: "$1,100",
            max_bid: {
              cents: 110000,
              display: "$1,100",
            },
            sale_artwork: {
              counts: {
                bidder_positions: 1,
              },
              lot_label: "14",
              lot_number: "14",
              position: 14,
              highest_bid: {
                cents: 110000,
                display: "$1,100",
              },
              artwork: {
                id: "josephine-meckseper-untitled-flag-2-2017",
                title: "Untitled (Flag 2), 2017",
                image: {
                  image_url: "https://d32dm0rphc51dk.cloudfront.net/3N6jyj5G_jjzYbkwbIM4tA/:version.jpg",
                },
                artist: {
                  name: "Josephine Meckseper",
                },
              },
            },
          },
        },
        {
          most_recent_bid: {
            gravityID: "594933e6275b244305851e9c",
            id: "594933e6275b244305851e9c",
            display_max_bid_amount_dollars: "$10,000",
            max_bid: {
              cents: 1000000,
              display: "$10,000",
            },
            sale_artwork: {
              counts: {
                bidder_positions: 1,
              },
              lot_label: "8",
              lot_number: "8",
              position: 8,
              highest_bid: {
                cents: 1000000,
                display: "$10,000",
              },
              artwork: {
                id: "robert-longo-untitled-dividing-time",
                title: "Untitled (Dividing Time)",
                image: {
                  image_url: "https://d32dm0rphc51dk.cloudfront.net/4GlhFa7ci5-0W25sjDNFIQ/:version.jpg",
                },
                artist: {
                  name: "Robert Longo",
                },
              },
            },
          },
        },
        {
          most_recent_bid: {
            gravityID: "594932d0275b244305851e99",
            id: "594932d0275b244305851e99",
            display_max_bid_amount_dollars: "$5,000",
            max_bid: {
              cents: 500000,
              display: "$5,000",
            },
            sale_artwork: {
              counts: {
                bidder_positions: 1,
              },
              lot_label: "2",
              lot_number: "2",
              position: 2,
              highest_bid: {
                cents: 500000,
                display: "$5,000",
              },
              artwork: {
                id: "trevor-paglen-weeping-angel",
                title: "Weeping Angel",
                image: {
                  image_url: "https://d32dm0rphc51dk.cloudfront.net/W-XblMAGxZJbhx0FfH1HtQ/:version.jpg",
                },
                artist: {
                  name: "Trevor Paglen",
                },
              },
            },
          },
        },
      ]
    : []

  return {
    conversations,
    conversations_existence_check: conversations,
    lot_standings: lotStandings,
  }
}
