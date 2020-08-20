import _ from "lodash"
import { __appStoreTestUtils__ } from "../AppStore"
import { CURRENT_APP_VERSION, migrate, Versions } from "../migration"
import { sanitize } from "../persistence"

describe(migrate, () => {
  it("leaves an object untouched if there are no migrations pending", () => {
    const result = migrate({
      state: {
        version: 1,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: s => {
          s.value = "modified"
        },
      },
    })

    expect((result as any).value).toBe("untouched")
    expect(result.version).toBe(1)
  })

  it("applies a migration if there is one pending", () => {
    const result = migrate({
      state: {
        version: 0,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: s => {
          s.value = "modified"
        },
      },
    })

    expect((result as any).value).toBe("modified")
    expect(result.version).toBe(1)
  })

  it("applies many migrations if there are many pending", () => {
    const result = migrate({
      state: {
        version: 0,
      },
      toVersion: 4,
      migrations: {
        [0]: s => {
          s.zero = true
        },
        [1]: s => {
          s.one = true
        },
        [2]: s => {
          s.two = true
        },
        [3]: s => {
          s.three = true
        },
        [4]: s => {
          s.four = true
        },
        [5]: s => {
          s.five = true
        },
      },
    })

    expect((result as any).zero).toBe(undefined)
    expect((result as any).one).toBe(true)
    expect((result as any).two).toBe(true)
    expect((result as any).three).toBe(true)
    expect((result as any).four).toBe(true)
    expect((result as any).five).toBe(undefined)
    expect(result.version).toBe(4)
  })

  it("throws an error if there is no valid version", () => {
    expect(() => {
      migrate({
        state: {
          // @ts-ignore
          version: "0",
        },
        toVersion: 1,
        migrations: {
          [1]: s => {
            s.zero = true
          },
        },
      })
    }).toThrowErrorMatchingInlineSnapshot(`"Bad state.version {\\"version\\":\\"0\\"}"`)
  })

  it("throws an error if there is no valid migration", () => {
    expect(() => {
      migrate({
        state: {
          version: 0,
        },
        toVersion: 1,
        migrations: {
          [0]: s => {
            s.zero = true
          },
        },
      })
    }).toThrowErrorMatchingInlineSnapshot(`"No migrator found for app version 1"`)
  })

  it("guarantees that the version number ends up correct", () => {
    const result = migrate({
      state: {
        version: 0,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: s => {
          s.value = "modified"
          s.version = 5
        },
      },
    })

    expect((result as any).value).toBe("modified")
    expect(result.version).toBe(1)
  })
})

/**
 * Getting a failure in this test? You may need a migration.
 * See adding_state_migrations.md for more information.
 * Reach out to #product-mobile-experience with questions.
 */
describe("artsy app store migrations", () => {
  it("are up to date", () => {
    __appStoreTestUtils__?.reset()
    expect(migrate({ state: { version: 0 } })).toEqual(sanitize(__appStoreTestUtils__?.getCurrentState()))
  })

  it("CURRENT_APP_VERSION is always the latest one", () => {
    expect(CURRENT_APP_VERSION).toBe(_.max(Object.values(Versions)))
  })

  it("Versions start from `1` and go increase by `1`", () => {
    expect(_.min(Object.values(Versions))).toBe(1)
    expect(Object.values(Versions).sort()).toStrictEqual(_.range(1, Object.values(Versions).length + 1))
  })
})
