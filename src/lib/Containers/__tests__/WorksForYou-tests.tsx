import React from "react"
import { NativeModules } from "react-native"
import * as renderer from "react-test-renderer"

import { WorksForYou } from "../WorksForYou"

import { Theme } from "@artsy/palette"

beforeAll(() => {
  WorksForYou.prototype.componentDidUpdate = () => {
    return null
  }
})

describe("with notifications", () => {
  it("updates the notification count", () => {
    const me = notificationsResponse().query.me
    renderer.create(
      <Theme>
        <WorksForYou
          me={me as any}
          // @ts-ignore STRICTNESS_MIGRATION
          relay={null}
        />
      </Theme>
    )
    expect(NativeModules.ARTemporaryAPIModule.markNotificationsRead).toBeCalled()
  })

  it("renders without throwing an error", () => {
    const me = notificationsResponse().query.me
    // @ts-ignore STRICTNESS_MIGRATION
    renderer.create(<WorksForYou me={me as any} relay={null} />)
  })
})

describe("without notifications", () => {
  it("renders without throwing an error", () => {
    const me = emptyStateResponse().query.me
    // @ts-ignore STRICTNESS_MIGRATION
    renderer.create(<WorksForYou me={me as any} relay={null} />)
  })
})

interface NotificationsResponse {
  query: {
    me: {
      followsAndSaves: {
        notifications: {
          pageInfo: {
            hasNextPage: boolean
            endCursor: string
          }
          edges: Array<{
            node: {
              artists: string
              summary: string
              artworks: { edges: [{ node: { title: string } }] }
              image: {
                resized: {
                  url: string
                }
              }
            }
          }>
        }
      }
    }

    selectedArtist?: any
  }
}

const notificationsResponse = () => {
  // @ts-ignore STRICTNESS_MIGRATION
  return {
    query: {
      me: {
        followsAndSaves: {
          notifications: {
            pageInfo: {
              hasNextPage: true,
              endCursor: null,
            },
            edges: [
              {
                node: {
                  artists: "Jean-Michel Basquiat",
                  summary: "1 Work Added",
                  artworks: { edges: [{ node: { title: "Anti-Product Postcard" } }] },
                  image: {
                    resized: {
                      url: "cloudfront.url",
                    },
                  },
                },
              },
              {
                node: {
                  artists: "Ana Mendieta",
                  summary: "2 Works Added",
                  artworks: {
                    edges: [{ node: { title: "Corazón de Roca con Sangre" } }, { node: { title: "Butterfly" } }],
                  },
                  image: {
                    resized: {
                      url: "cloudfront.url",
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  } as NotificationsResponse
}

const emptyStateResponse = () => {
  return {
    query: {
      me: {
        followsAndSaves: {
          notifications: {
            pageInfo: {
              hasNextPage: true,
            },
            edges: [],
          },
        },
      },
    },
  }
}
