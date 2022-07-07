import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { GlobalStore } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { Linking } from "react-native"
import { navigate } from "./navigate"

function args(mock: jest.Mock) {
  return mock.mock.calls[mock.mock.calls.length - 1]
}

jest.unmock("./navigate")

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

jest.mock("app/store/GlobalStore", () => ({
  unsafe__getSelectedTab: jest.fn().mockReturnValue("home"),
  unsafe__getEnvironment: jest.fn().mockReturnValue({
    webURL: "https://www.artsy.net",
  }),
  unsafe_getDevToggle: jest.fn().mockReturnValue(false),
  GlobalStore: {
    actions: {
      bottomTabs: {
        setTabProps: jest.fn(),
      },
    },
  },
}))

describe(navigate, () => {
  beforeEach(() => {
    Linking.openURL = jest.fn()
    LegacyNativeModules.ARScreenPresenterModule.pushView = jest.fn()
  })

  describe("routes to various screens", () => {
    it("like artwork", () => {
      navigate("/artwork/josef-albers-homage-to-the-square")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalled()
      expect(args(LegacyNativeModules.ARScreenPresenterModule.pushView as any))
        .toMatchInlineSnapshot(`
        Array [
          "home",
          Object {
            "moduleName": "Artwork",
            "props": Object {
              "artworkID": "josef-albers-homage-to-the-square",
            },
            "replace": false,
            "type": "react",
          },
        ]
      `)
    })
    it("like artist", () => {
      navigate("/artist/banksy")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalled()
      expect(args(LegacyNativeModules.ARScreenPresenterModule.pushView as any))
        .toMatchInlineSnapshot(`
        Array [
          "home",
          Object {
            "hidesBackButton": true,
            "moduleName": "Artist",
            "props": Object {
              "artistID": "banksy",
            },
            "replace": false,
            "type": "react",
          },
        ]
      `)
    })
    it("like vanity urls", () => {
      navigate("/artsy-vanguard-2019")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalled()
      expect(args(LegacyNativeModules.ARScreenPresenterModule.pushView as any))
        .toMatchInlineSnapshot(`
        Array [
          "home",
          Object {
            "fullBleed": true,
            "moduleName": "VanityURLEntity",
            "props": Object {
              "slug": "artsy-vanguard-2019",
            },
            "replace": false,
            "type": "react",
          },
        ]
      `)
    })
  })

  it("opens external urls with Linking", () => {
    navigate("https://google.com/banana")
    expect(Linking.openURL).toHaveBeenCalledWith("https://google.com/banana")
  })

  it("passes additional props", async () => {
    await navigate("/artist/banksy", {
      passProps: {
        someAdditionalKey: "value",
      },
    })
    expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalled()
    expect(args(LegacyNativeModules.ARScreenPresenterModule.pushView as any))
      .toMatchInlineSnapshot(`
        Array [
          "home",
          Object {
            "hidesBackButton": true,
            "moduleName": "Artist",
            "props": Object {
              "artistID": "banksy",
              "someAdditionalKey": "value",
            },
            "replace": false,
            "type": "react",
          },
        ]
      `)
  })

  describe("presents modals", () => {
    it("when the screen requires it", () => {
      navigate("https://live.artsy.net/blah")
      expect(args(LegacyNativeModules.ARScreenPresenterModule.presentModal as any))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "alwaysPresentModally": true,
            "hasOwnModalCloseButton": true,
            "modalPresentationStyle": "fullScreen",
            "moduleName": "LiveAuction",
            "props": Object {
              "slug": "blah",
            },
            "replace": false,
            "type": "react",
          },
        ]
      `)
    })

    it("when the modal option is set", () => {
      navigate("/artwork/kaws-cross-eyed-weird-ears-cartoon-thing", { modal: true })
      expect(args(LegacyNativeModules.ARScreenPresenterModule.presentModal as any))
    })
  })

  it("switches tab and pops the view stack when routing to a root tab view", async () => {
    await navigate("/search")
    expect(LegacyNativeModules.ARScreenPresenterModule.switchTab).toHaveBeenCalledWith("search")
    expect(
      LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop
    ).toHaveBeenCalledWith("search")
  })

  it("passes tab props when switching", async () => {
    await navigate("/search?query=banksy")
    expect(LegacyNativeModules.ARScreenPresenterModule.switchTab).toHaveBeenCalledWith("search")
    expect(
      LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop
    ).toHaveBeenCalledWith("search")
    expect(GlobalStore.actions.bottomTabs.setTabProps).toHaveBeenCalledWith({
      tab: "search",
      props: { query: "banksy" },
    })
  })

  it("switches tab before pushing in cases where that's required", async () => {
    await navigate("/conversation/234")
    expect(LegacyNativeModules.ARScreenPresenterModule.switchTab).toHaveBeenCalledWith("inbox")
    await flushPromiseQueue()
    expect(args(LegacyNativeModules.ARScreenPresenterModule.pushView as any))
      .toMatchInlineSnapshot(`
      Array [
        "inbox",
        Object {
          "moduleName": "Conversation",
          "onlyShowInTabName": "inbox",
          "props": Object {
            "conversationID": "234",
          },
          "replace": false,
          "type": "react",
        },
      ]
    `)
  })

  it("pop to root tab view in cases where that's required", async () => {
    await navigate("my-profile/payment")
    await navigate("my-profile/saved-search-alerts", {
      popToRootTabView: true,
      showInTabName: "profile",
    })

    await flushPromiseQueue()

    expect(LegacyNativeModules.ARScreenPresenterModule.switchTab).toHaveBeenCalledWith("profile")
    expect(args(LegacyNativeModules.ARScreenPresenterModule.pushView as any))
      .toMatchInlineSnapshot(`
      Array [
        "profile",
        Object {
          "moduleName": "SavedSearchAlertsList",
          "props": Object {},
          "replace": false,
          "type": "react",
        },
      ]
    `)
  })

  describe("debouncing", () => {
    const dateNow = Date.now
    const mockDateNow = jest.fn(() => 0)
    beforeEach(() => {
      mockDateNow.mockClear()
    })
    beforeAll(() => {
      Date.now = mockDateNow
    })
    afterAll(() => {
      Date.now = dateNow
    })

    it("happens when the user taps more than once in under a second", async () => {
      await navigate("/artist/banksy")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(100)
      await navigate("/artist/banksy")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(500)
      await navigate("/artist/banksy")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(999)
      await navigate("/artist/banksy")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(1)
    })

    it("doesn't happen when the user taps more than once in more than a second", async () => {
      mockDateNow.mockReturnValue(0)
      await navigate("/artist/andy-warhol")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(100)
      await navigate("/artist/andy-warhol")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(1500)
      await navigate("/artist/andy-warhol")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(2)

      mockDateNow.mockReturnValue(2000)
      await navigate("/artist/andy-warhol")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(2)

      mockDateNow.mockReturnValue(5000)
      await navigate("/artist/andy-warhol")
      expect(LegacyNativeModules.ARScreenPresenterModule.pushView).toHaveBeenCalledTimes(3)
    })
  })
})
