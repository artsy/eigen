import AsyncStorage from "@react-native-community/async-storage"
import { migrate } from "../migration"
import { assignDeep, LEGACY_SEARCH_STORAGE_KEY, omitDeep, persist, STORAGE_KEY, unpersist } from "../persistence"

jest.mock("../migration", () => ({ migrate: jest.fn(a => a.state) }))

describe(omitDeep, () => {
  const fixture = {
    foo: true,
    bar: true,
    baz: [{ foo: true, bar: true }, { baz: true }, { foo: false }],
    biz: {
      foo: {
        bar: true,
      },
      bar: [
        {
          bar: {
            foo: true,
          },
        },
      ],
    },
  }

  it("removes a key from a nested structure without modifying the original", () => {
    expect(omitDeep(fixture, "foo")).toEqual({
      bar: true,
      baz: [{ bar: true }, { baz: true }, {}],
      biz: {
        bar: [
          {
            bar: {},
          },
        ],
      },
    })
    expect(fixture.foo).toBe(true)
  })
})

describe(assignDeep, () => {
  it("merges one object into another, modifying the underlying object", () => {
    const obj = {
      foo: true,
    }
    assignDeep(obj, { bar: true })
    expect(obj).toEqual({ foo: true, bar: true })
  })
  it("overwrites existing properties", () => {
    const obj = {
      foo: true,
      bar: false,
    }
    assignDeep(obj, { bar: true })
    expect(obj).toEqual({ foo: true, bar: true })
  })
  it("deeply merges aligned objects", () => {
    const obj = {
      foo: {
        bar: false,
        foo: {
          bar: false,
          biz: true,
        },
        biz: true,
      },
    }
    assignDeep(obj, { foo: { bar: true, baz: true, foo: { bar: true, baz: true } } })
    expect(obj).toEqual({ foo: { bar: true, baz: true, biz: true, foo: { bar: true, baz: true, biz: true } } })
  })
  it("overwrites misaligned objects", () => {
    const obj = {
      foo: { bar: true },
      bar: true,
      baz: false,
    }
    assignDeep(obj, { foo: true, bar: { foo: true } })
    expect(obj).toEqual({ foo: true, bar: { foo: true }, baz: false })
  })
  it("does not merge inside arrays", () => {
    const obj = {
      foo: [{ bar: true }],
    }
    assignDeep(obj, { foo: [{}] })
    expect(obj).toEqual({ foo: [{}] })
  })
})

describe(persist, () => {
  beforeEach(() => {
    require("@react-native-community/async-storage").__resetState()
  })
  it("omits the sessionStorage key", async () => {
    await persist({ bottomTabs: { selectedTab: "home", sessionState: { unreadConversationCount: 5 } } } as any)
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? "")).toEqual({
      bottomTabs: { selectedTab: "home" },
    })
  })
  it("overwrites the previous value", async () => {
    await persist({ bottomTabs: { selectedTab: "home", sessionState: { unreadConversationCount: 5 } } } as any)
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? "")).toEqual({
      bottomTabs: { selectedTab: "home" },
    })
    await persist({ bottomTabs: { selectedTab: "explore", sessionState: { unreadConversationCount: 5 } } } as any)
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? "")).toEqual({
      bottomTabs: { selectedTab: "explore" },
    })
  })
})

describe(unpersist, () => {
  beforeEach(() => {
    require("@react-native-community/async-storage").__resetState()
  })
  it("returns an empty object if there was nothing saved before", async () => {
    expect(await unpersist()).toEqual({})
  })
  it("runs migrations if something was saved before", async () => {
    ;(migrate as jest.Mock).mockImplementationOnce(data => ({ ...data.state, wasMigrated: true }))
    await AsyncStorage.setItem(STORAGE_KEY, '{"wasStored": true}')
    expect(await unpersist()).toEqual({
      wasStored: true,
      wasMigrated: true,
    })
  })
  it("returns an empty object if the stored json is corrupt", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "{: 0}")
    expect(await unpersist()).toEqual({})
  })

  it("loads legacy search state", async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        search: {
          recentSearches: [],
        },
      })
    )
    await AsyncStorage.setItem(
      LEGACY_SEARCH_STORAGE_KEY,
      JSON.stringify([
        {
          type: "AUTOSUGGEST_RESULT_TAPPED",
          props: {
            displayLabel: "Banksy",
            displayType: "Artist",
            href: "https://artsy.com/artist/banksy",
            imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
          },
        },
      ])
    )

    expect(await unpersist()).toMatchObject({ search: { recentSearches: [{ props: { displayLabel: "Banksy" } }] } })
  })

  it("ignores corrupt legacy search state", async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        search: {
          recentSearches: [{ props: { displayLabel: "i am a recent search" } }],
        },
      })
    )
    await AsyncStorage.setItem(LEGACY_SEARCH_STORAGE_KEY, "{: 0}")

    expect((await unpersist()).search?.recentSearches?.[0]?.props?.displayLabel).toBe("i am a recent search")

    await AsyncStorage.setItem(LEGACY_SEARCH_STORAGE_KEY, "{}")

    expect((await unpersist()).search?.recentSearches?.[0]?.props?.displayLabel).toBe("i am a recent search")
  })

  it("loads legacy search state even if no existing app state was present", async () => {
    await AsyncStorage.setItem(
      LEGACY_SEARCH_STORAGE_KEY,
      JSON.stringify([
        {
          type: "AUTOSUGGEST_RESULT_TAPPED",
          props: {
            displayLabel: "Banksy",
            displayType: "Artist",
            href: "https://artsy.com/artist/banksy",
            imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
          },
        },
      ])
    )

    expect(await unpersist()).toMatchObject({ search: { recentSearches: [{ props: { displayLabel: "Banksy" } }] } })
  })
})
