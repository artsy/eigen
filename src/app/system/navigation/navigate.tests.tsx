import { internal_navigationRef } from "app/Navigation/Navigation"
import { GlobalStore } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { Linking } from "react-native"
import { navigate } from "./navigate"

jest.unmock("./navigate")

jest.mock("app/utils/hooks/useVisualClue", () => ({
  addClue: jest.fn(),
  setVisualClueAsSeen: jest.fn(),
}))

jest.mock("app/store/GlobalStore", () => ({
  unsafe__getSelectedTab: jest.fn().mockReturnValue("home"),
  unsafe__getEnvironment: jest.fn().mockReturnValue({
    webURL: "https://www.artsy.net",
  }),
  unsafe_getFeatureFlag: jest.fn(),
  unsafe_getDevToggle: jest.fn().mockReturnValue(false),
  GlobalStore: {
    actions: {
      bottomTabs: {
        setTabProps: jest.fn(),
        setSelectedTab: jest.fn(),
      },
    },
  },
}))

describe(navigate, () => {
  beforeEach(() => {
    // @ts-expect-error
    internal_navigationRef.current = {
      isReady: jest.fn().mockReturnValue(true),
      dispatch: jest.fn(),
    }

    Linking.openURL = jest.fn()
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("routes to various screens", () => {
    it("like artwork", async () => {
      navigate("/artwork/josef-albers-homage-to-the-square")
      await flushPromiseQueue()
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledWith({
        payload: { name: "Artwork", params: { artworkID: "josef-albers-homage-to-the-square" } },
        type: "PUSH",
      })
    })
    it("like artist", async () => {
      navigate("/artist/banksy")
      await flushPromiseQueue()
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledWith({
        payload: { name: "Artist", params: { artistID: "banksy" } },
        type: "PUSH",
      })
    })
    it("like vanity urls", async () => {
      navigate("/artsy-vanguard-2019")
      await flushPromiseQueue()
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledWith({
        payload: { name: "VanityURLEntity", params: { slug: "artsy-vanguard-2019" } },
        type: "PUSH",
      })
    })
  })

  it("opens external urls with Linking", async () => {
    navigate("https://google.com/banana")
    await flushPromiseQueue()
    expect(Linking.openURL).toHaveBeenCalledWith("https://google.com/banana")
  })

  it("passes additional props", async () => {
    await navigate("/artist/banksy", {
      passProps: {
        someAdditionalKey: "value",
      },
    })
    expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledWith({
      payload: { name: "Artist", params: { artistID: "banksy", someAdditionalKey: "value" } },
      type: "PUSH",
    })
  })

  describe("marketing links", () => {
    const fetch = jest.fn((_url, _init) =>
      Promise.resolve({ url: "https://artsy.net/artist/kaws" })
    )
    // @ts-ignore
    global.fetch = fetch
    beforeEach(() => {
      fetch.mockClear()
    })

    it("reroutes marketing links", async () => {
      await navigate("https://click.artsy.net/artist/kaws")
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledWith({
        payload: { name: "Artist", params: { artistID: "kaws" } },
        type: "PUSH",
      })
    })
  })

  it("switches tab and pops the view stack when routing to a root tab view", async () => {
    await navigate("/search")
    expect(GlobalStore.actions.bottomTabs.setSelectedTab).toHaveBeenCalledWith("search")
    expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledWith({
      payload: { name: "search", params: {} },
      type: "JUMP_TO",
    })
  })

  it("passes tab props when switching", async () => {
    await navigate("/search?query=banksy")
    expect(GlobalStore.actions.bottomTabs.setSelectedTab).toHaveBeenCalledWith("search")
    expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledWith({
      payload: { name: "search", params: { query: "banksy" } },
      type: "JUMP_TO",
    })

    expect(GlobalStore.actions.bottomTabs.setTabProps).toHaveBeenCalledWith({
      tab: "search",
      props: { query: "banksy" },
    })
  })

  it("switches tab before pushing in cases where that's required", async () => {
    await navigate("/conversation/234")
    expect(GlobalStore.actions.bottomTabs.setSelectedTab).toHaveBeenCalledWith("inbox")
    await flushPromiseQueue()
    expect(internal_navigationRef.current?.dispatch).toHaveBeenNthCalledWith(1, {
      payload: { name: "inbox", params: { conversationID: "234" } },
      type: "JUMP_TO",
    })
    expect(internal_navigationRef.current?.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { name: "Conversation", params: { conversationID: "234" } },
      type: "PUSH",
    })
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
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(100)
      await navigate("/artist/banksy")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(500)
      await navigate("/artist/banksy")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(999)
      await navigate("/artist/banksy")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(1)
    })

    it("doesn't happen when the user taps more than once in more than a second", async () => {
      mockDateNow.mockReturnValue(0)
      await navigate("/artist/andy-warhol")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(100)
      await navigate("/artist/andy-warhol")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(1)

      mockDateNow.mockReturnValue(1500)
      await navigate("/artist/andy-warhol")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(2)

      mockDateNow.mockReturnValue(2000)
      await navigate("/artist/andy-warhol")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(2)

      mockDateNow.mockReturnValue(5000)
      await navigate("/artist/andy-warhol")
      expect(internal_navigationRef.current?.dispatch).toHaveBeenCalledTimes(3)
    })
  })
})
