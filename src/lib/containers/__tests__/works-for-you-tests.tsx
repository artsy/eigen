import * as React from "react"
import { NativeModules } from "react-native"
import * as renderer from "react-test-renderer"

import { renderWithLayout } from "../../tests/render_with_layout"
import { WorksForYou } from "../works_for_you"

beforeAll(() => {
  NativeModules.ARTemporaryAPIModule = { markNotificationsRead: jest.fn() }
  NativeModules.ARWorksForYouModule = { updateNotificationsCount: jest.fn() }
})

describe("with notifications", () => {
  it("creates a ListViewDataSource upon instantiation", () => {
    const worksForYou = new WorksForYou(notificationsResponse())
    expect(worksForYou.state.dataSource).toBeTruthy()
  })

  it("updates the notification count", () => {
    const me = notificationsResponse().me
    const worksForYou = renderer.create(<WorksForYou me={me} relay={null}/>).toJSON()
    expect(NativeModules.ARTemporaryAPIModule.markNotificationsRead).toBeCalled()
  })

  it("lays out correctly on small screens", () => {
    const me = notificationsResponse().me
    const component = renderWithLayout(<WorksForYou me={me} relay={null}/>, {width: 100})
    expect(component).toMatchSnapshot()
  })

  it("lays out correctly on larger screens", () => {
    const me = notificationsResponse().me
    const component = renderWithLayout(<WorksForYou me={me} relay={null}/>, {width: 700})
    expect(component).toMatchSnapshot()
  })
})

describe("without notifications", () => {
  it("does not create a ListViewDataSource", () => {
    const worksForYou = new WorksForYou(emptyStateResponse())
    expect(worksForYou.state.dataSource).toBeFalsy()
  })

  it("lays out correctly on small screens", () => {
    const me = emptyStateResponse().me
    const component = renderWithLayout(<WorksForYou me={me} relay={null}/>, {width: 100})
    expect(component).toMatchSnapshot()
  })

  it("lays out correctly on larger screens", () => {
    const me = emptyStateResponse().me
    const component = renderWithLayout(<WorksForYou me={me} relay={null}/>, { width: 700 })
    expect(component).toMatchSnapshot()
  })
})

let notificationsResponse = () => {
  return {
    me: {
      notifications_connection: {
        pageInfo: {
          hasNextPage: true,
        },
        edges: [
          {
            node: {
              artists: "Jean-Michel Basquiat",
              date: "Mar 16",
              message: "1 Work Added",
              artworks: [ { title: "Anti-Product Postcard" } ],
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
              date: "Mar 16",
              message: "2 Works Added",
              artworks: [ { title: "Corazón de Roca con Sangre" }, { title: "Butterfly" } ],
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
  }
}

let emptyStateResponse = () => {
  return {
    me: {
      notifications_connection: {
        pageInfo: {
          hasNextPage: true,
        },
        edges: [],
      },
    },
  }
}
