import AsyncStorage from "@react-native-async-storage/async-storage"
import { clear, clearAll, get, requestFingerprint, set } from "./RelayCache"

describe(requestFingerprint, () => {
  it("makes a fingerprint of a graphql request with a stable key ordering", () => {
    const fingerprintA = requestFingerprint("myQueryID", { a: "A", b: "B", c: "C" })
    const fingerprintB = requestFingerprint("myQueryID", { b: "B", c: "C", a: "A" })
    expect(fingerprintA).toMatchInlineSnapshot(
      `"{\\"myQueryID\\":{\\"a\\":\\"A\\",\\"b\\":\\"B\\",\\"c\\":\\"C\\"}}"`
    )
    expect(fingerprintA).toEqual(fingerprintB)
  })
  it("works with nested objects and arrays", () => {
    expect(
      requestFingerprint("myQueryID", {
        a: "A",
        b: ["banana", "bingo", { bratislava: true, bristol: null, brightonBeach: 345 }],
        c: "C",
      })
    ).toMatchInlineSnapshot(
      `"{\\"myQueryID\\":{\\"a\\":\\"A\\",\\"b\\":[\\"banana\\",\\"bingo\\",{\\"bratislava\\":true,\\"brightonBeach\\":345,\\"bristol\\":null}],\\"c\\":\\"C\\"}}"`
    )
  })
  it("should produce valid json (implementation detail)", () => {
    const data = {
      b: ["banana", "bingo", { bratislava: true, bristol: null }],
      a: "A",
      c: "C",
    }
    expect(JSON.parse(requestFingerprint("myQueryID", data))).toEqual({
      myQueryID: data,
    })
  })
})

describe("the cache", () => {
  const currentTime = 1611234089917
  const nowMock = jest.fn(() => currentTime)
  const properNow = Date.now
  beforeAll(() => {
    Date.now = nowMock
    jest.useFakeTimers()
  })
  afterAll(() => {
    Date.now = properNow
    jest.useRealTimers()
  })
  beforeEach(() => {
    ;(AsyncStorage as any).__resetState()
  })
  it("saves queries in async storage", async () => {
    set("myQueryID", { foo: "bar" }, "response!")
    expect(await AsyncStorage.getAllKeys()).toMatchInlineSnapshot(`
      Array [
        "RelayCache:{\\"myQueryID\\":{\\"foo\\":\\"bar\\"}}",
      ]
    `)
    set("mySecondQueryID", { lol: "rofl" }, "another response!")
    expect(await AsyncStorage.getAllKeys()).toMatchInlineSnapshot(`
      Array [
        "RelayCache:{\\"myQueryID\\":{\\"foo\\":\\"bar\\"}}",
        "RelayCache:{\\"mySecondQueryID\\":{\\"lol\\":\\"rofl\\"}}",
      ]
    `)

    expect(await get("myQueryID", { foo: "bar" })).toBe("response!")
    expect(await get("mySecondQueryID", { lol: "rofl" })).toBe("another response!")
  })

  it("respects ttl params", async () => {
    // set ttl to 1 second
    set("myQueryID", { foo: "bar" }, "response!", 1)
    expect(await AsyncStorage.getAllKeys()).toHaveLength(1)
    // wait 2 seconds
    nowMock.mockReturnValueOnce(currentTime + 2000)
    expect(await get("myQueryID", { foo: "bar" })).toBe(null)
    expect(await AsyncStorage.getAllKeys()).toHaveLength(0)
  })

  it("allows removal", async () => {
    set("myQueryID", { foo: "bar" }, "response!", 1)
    expect(await AsyncStorage.getAllKeys()).toHaveLength(1)
    clear("myQueryID", { foo: "bar" })
    expect(await AsyncStorage.getAllKeys()).toHaveLength(0)
  })

  it("allows clearing the whole cache without impacting other things using AsyncStorage", async () => {
    AsyncStorage.setItem("MyImportantItem", "hello")
    set("myQueryID", { foo: "bar" }, "response!", 1)
    set("mySecondQueryID", { lol: "rofl" }, "another response!")
    expect(await AsyncStorage.getAllKeys()).toHaveLength(3)

    await clearAll()

    expect(await AsyncStorage.getAllKeys()).toEqual(["MyImportantItem"])
  })
})
