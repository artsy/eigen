import { __appStoreTestUtils__, AppStore } from "lib/store/AppStore"
import React from "react"

describe("MyCollectionNavigationkModel", () => {
  it("calls the main navigator when goBack is triggered", () => {
    const mockNavigator = (name: string, mockPop: () => void = jest.fn()) => {
      const mockedComponent = ({ children }: any) => <div>{children}</div>
      const pop = () => {
        mockPop()
      }
      mockedComponent.name = name
      mockedComponent.pop = pop
      return mockedComponent
    }

    const modalMockPop = jest.fn()
    const modalNavigator = mockNavigator("modal", modalMockPop)
    const mainMockPop = jest.fn()
    const mainNavigator = mockNavigator("main", mainMockPop)

    const navigationActions = AppStore.actions.myCollection.navigation
    __appStoreTestUtils__?.injectState({
      myCollection: {
        navigation: {
          sessionState: {
            navigators: {
              main: {
                name: "main",
                title: "main",
                navigator: mainNavigator as any,
              },
              modal: {
                name: "modal",
                title: "modal",
                navigator: modalNavigator as any,
              },
            },
          },
        },
      },
    })

    navigationActions.goBack()
    expect(mainMockPop).toHaveBeenCalled()
    expect(modalMockPop).not.toHaveBeenCalled()
  })
})
