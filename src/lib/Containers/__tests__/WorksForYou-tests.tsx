import React from "react"
import { NativeModules } from "react-native"
import * as renderer from "react-test-renderer"

import { renderWithLayout } from "../../tests/renderWithLayout"
import { WorksForYou } from "../WorksForYou"

import { Theme } from "@artsy/palette"

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { markNotificationsRead: jest.fn() }
  WorksForYou.prototype.componentDidUpdate = () => {
    return null
  }
})

describe("with notifications", () => {
  it("updates the notification count", () => {
    const query = notificationsResponse().query
    renderer
      .create(
        <Theme>
          <WorksForYou query={query as any} relay={null} />
        </Theme>
      )
      .toJSON()
    expect(NativeModules.ARTemporaryAPIModule.markNotificationsRead).toBeCalled()
  })

  it("lays out correctly on small screens", () => {
    const query = notificationsResponse().query
    const component = renderWithLayout(<WorksForYou query={query as any} relay={null} />, { width: 100 })
    expect(component).toMatchSnapshot()
  })

  it("lays out correctly on larger screens", () => {
    const query = notificationsResponse().query
    const component = renderWithLayout(<WorksForYou query={query as any} relay={null} />, { width: 700 })
    expect(component).toMatchSnapshot()
  })
})

describe("without notifications", () => {
  it("lays out correctly on small screens", () => {
    const query = emptyStateResponse().query
    const component = renderWithLayout(<WorksForYou query={query as any} relay={null} />, { width: 100 })
    expect(component).toMatchSnapshot()
  })

  it("lays out correctly on larger screens", () => {
    const query = emptyStateResponse().query
    const component = renderWithLayout(<WorksForYou query={query as any} relay={null} />, { width: 700 })
    expect(component).toMatchSnapshot()
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
              artworks: { edges: [{ title: string }] }
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
                  artworks: { edges: [{ title: "Anti-Product Postcard" }] },
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
                  artworks: { edges: [{ title: "Corazón de Roca con Sangre" }, { title: "Butterfly" }] },
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
