import AsyncStorage from "@react-native-async-storage/async-storage"
import { migrate } from "./migration"
import {
  assignDeep,
  LEGACY_SEARCH_STORAGE_KEY,
  persist,
  sanitize,
  STORAGE_KEY,
  unpersist,
} from "./persistence"

jest.mock("./migration", () => ({ migrate: jest.fn((a) => a.state) }))

describe(sanitize, () => {
  const fixture = {
    sessionState: { blah: true },
    get computedProperty() {
      return 3
    },
    persistedProperty: true,
    bar: {
      sessionState: { blah: true },
      get nestedComputedProperty() {
        return 3
      },
      nestedPersistedProperty: "hello",
    },
    baz: [
      {
        sessionState: { blah: true },
        get nestedInArrayComputedProperty() {
          return 3
        },
        nestedInArrayPersistedProperty: 3,
      },
    ],
  }

  it("removes computed properties and session states", () => {
    expect(sanitize(fixture)).toEqual({
      persistedProperty: true,
      bar: {
        nestedPersistedProperty: "hello",
      },
      baz: [{ nestedInArrayPersistedProperty: 3 }],
    })
  })

  it("can't serialize non-json-compatible properties", () => {
    expect(sanitize({ regex: /abcdef/g })).toEqual({ regex: null })
    expect(console.error).toHaveBeenCalled()
    expect((console.error as jest.Mock).mock.calls[0][0]).toMatchInlineSnapshot(
      `"Cannot serialize value at path regex: /abcdef/g"`
    )
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
      level0: {
        a: false,
        b: true,
        level1: {
          a: false,
          b: true,
        },
      },
    }
    assignDeep(obj, {
      level0: {
        a: true,
        c: true,
        level1: {
          a: true,
          c: true,
        },
      },
    })
    expect(obj).toEqual({
      level0: {
        a: true,
        b: true,
        c: true,
        level1: {
          a: true,
          b: true,
          c: true,
        },
      },
    })
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
    require("@react-native-async-storage/async-storage").__resetState()
  })
  it("omits the sessionStorage key", async () => {
    await persist({
      bottomTabs: { selectedTab: "home", sessionState: { unreadConversationCount: 5 } },
    } as any)
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? "")).toEqual({
      bottomTabs: { selectedTab: "home" },
    })
  })
  it("overwrites the previous value", async () => {
    await persist({
      bottomTabs: { selectedTab: "home", sessionState: { unreadConversationCount: 5 } },
    } as any)
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? "")).toEqual({
      bottomTabs: { selectedTab: "home" },
    })
    await persist({
      bottomTabs: { selectedTab: "explore", sessionState: { unreadConversationCount: 5 } },
    } as any)
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? "")).toEqual({
      bottomTabs: { selectedTab: "explore" },
    })
  })
})

describe(unpersist, () => {
  beforeEach(() => {
    require("@react-native-async-storage/async-storage").__resetState()
  })
  it("returns an empty object if there was nothing saved before", async () => {
    expect(await unpersist()).toEqual({})
  })
  it("runs migrations if something was saved before", async () => {
    ;(migrate as jest.Mock).mockImplementationOnce((data) => ({ ...data.state, wasMigrated: true }))
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

    expect(await unpersist()).toMatchObject({
      search: { recentSearches: [{ props: { displayLabel: "Banksy" } }] },
    })
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

    expect((await unpersist()).search?.recentSearches?.[0]?.props?.displayLabel).toBe(
      "i am a recent search"
    )

    await AsyncStorage.setItem(LEGACY_SEARCH_STORAGE_KEY, "{}")

    expect((await unpersist()).search?.recentSearches?.[0]?.props?.displayLabel).toBe(
      "i am a recent search"
    )
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

    expect(await unpersist()).toMatchObject({
      search: { recentSearches: [{ props: { displayLabel: "Banksy" } }] },
    })
  })
})
