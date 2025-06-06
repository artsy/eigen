import { WorksForYou } from "app/Components/Containers/WorksForYou"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

beforeAll(() => {
  WorksForYou.prototype.componentDidUpdate = () => {
    return null
  }
})

describe("with notifications", () => {
  it("updates the notification count", () => {
    const me = notificationsResponse().query.me
    renderWithWrappersLEGACY(<WorksForYou me={me as any} relay={null as any} />)
    expect(LegacyNativeModules.ARTemporaryAPIModule.markNotificationsRead).toBeCalled()
  })

  it("renders without throwing an error", () => {
    const me = notificationsResponse().query.me
    renderWithWrappersLEGACY(<WorksForYou me={me as any} relay={null as any} />)
  })
})

describe("without notifications", () => {
  it("renders without throwing an error", () => {
    const me = emptyStateResponse().query.me
    renderWithWrappersLEGACY(<WorksForYou me={me as any} relay={null as any} />)
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
  return {
    query: {
      me: {
        followsAndSaves: {
          notifications: {
            pageInfo: {
              hasNextPage: true,
              endCursor: "",
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
                    edges: [
                      { node: { title: "Corazón de Roca con Sangre" } },
                      { node: { title: "Butterfly" } },
                    ],
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
