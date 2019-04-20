import React from "react"
import { NativeModules } from "react-native"
import * as renderer from "react-test-renderer"

import { renderWithLayout } from "../../tests/renderWithLayout"
import { WorksForYou } from "../WorksForYou"

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { markNotificationsRead: jest.fn() }
  WorksForYou.prototype.componentDidUpdate = () => {
    return null
  }
})

describe("with notifications", () => {
  it("creates a ListViewDataSource upon instantiation", () => {
    const worksForYou = new WorksForYou(notificationsResponse() as any)
    expect(worksForYou.state.dataSource).toBeTruthy()
  })

  it("updates the notification count", () => {
    const viewer = notificationsResponse().viewer
    renderer.create(<WorksForYou viewer={viewer as any} relay={null} />).toJSON()
    expect(NativeModules.ARTemporaryAPIModule.markNotificationsRead).toBeCalled()
  })

  it("lays out correctly on small screens", () => {
    const viewer = notificationsResponse().viewer
    const component = renderWithLayout(<WorksForYou viewer={viewer as any} relay={null} />, { width: 100 })
    expect(component).toMatchSnapshot()
  })

  it("lays out correctly on larger screens", () => {
    const viewer = notificationsResponse().viewer
    const component = renderWithLayout(<WorksForYou viewer={viewer as any} relay={null} />, { width: 700 })
    expect(component).toMatchSnapshot()
  })
})

describe("when it has a special notification", () => {
  it("properly formats it and adds it to the top of the dataSource blob", () => {
    const response = selectedArtistResponse()
    const worksForYou = new WorksForYou(response as any)
    const expectedFormattedNotification = {
      id: "notification-juliana-huxtable",
      message: "1 Work Added",
      artists: "Juliana Huxtable",
      artworks: selectedArtistResponse().viewer.selectedArtist.artworks,
      image: {
        resized: {
          url: "cloudfront.url",
        },
      },
      artistHref: "artist/juliana-huxtable",
    }
    expect(worksForYou.state.dataSource.getRowData(0, 0)).toEqual(expectedFormattedNotification)
  })
})

describe("without notifications", () => {
  it("does not create a ListViewDataSource", () => {
    const worksForYou = new WorksForYou(emptyStateResponse() as any)
    expect(worksForYou.state.dataSource).toBeFalsy()
  })

  it("lays out correctly on small screens", () => {
    const viewer = emptyStateResponse().viewer
    const component = renderWithLayout(<WorksForYou viewer={viewer as any} relay={null} />, { width: 100 })
    expect(component).toMatchSnapshot()
  })

  it("lays out correctly on larger screens", () => {
    const viewer = emptyStateResponse().viewer
    const component = renderWithLayout(<WorksForYou viewer={viewer as any} relay={null} />, { width: 700 })
    expect(component).toMatchSnapshot()
  })
})

interface NotificationsResponse {
  viewer: {
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
              artworks: [{ title: string }]
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
    viewer: {
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
                  artworks: [{ title: "Anti-Product Postcard" }],
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
                  artworks: [{ title: "Corazón de Roca con Sangre" }, { title: "Butterfly" }],
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
    viewer: {
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

const selectedArtistResponse = () => {
  {
    const response = notificationsResponse()
    response.viewer.selectedArtist = {
      id: "juliana-huxtable",
      name: "Juliana Huxtable",
      href: "artist/juliana-huxtable",
      image: {
        resized: {
          url: "cloudfront.url",
        },
      },
      artworks: [
        {
          id: "4594385943",
          title: "Untitled (Casual Power)",
        },
      ],
    }
    return response
  }
}
