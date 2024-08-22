import {
  userShouldBePromptedToCompleteProfile,
  userShouldBePromptedToAddArtistsToCollection,
} from "./collectorPromptHelpers"

// Mock Date to avoid issues with time-based tests
const MOCK_DATE = new Date("2024-08-20T00:00:00Z")
global.Date.now = jest.fn(() => MOCK_DATE.getTime())

describe("userShouldBePromptedToCompleteProfile", () => {
  it("should prompt the user when city and profession are missing and cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: undefined,
      profession: undefined,
      lastUpdatePromptAt: "2024-07-01T00:00:00Z",
    })

    expect(result).toBe(true)
  })

  it("should not prompt the user when city and profession are missing but cooldown period has not passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: undefined,
      profession: undefined,
      lastUpdatePromptAt: "2024-08-15T00:00:00Z",
    })

    expect(result).toBe(false)
  })

  it("should not prompt the user when city and profession are provided even if cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: "New York",
      profession: "Artist",
      lastUpdatePromptAt: "2024-07-01T00:00:00Z",
    })

    expect(result).toBe(false)
  })

  it("should prompt the user when profession is missing and cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: "New York",
      profession: undefined,
      lastUpdatePromptAt: "2024-07-01T00:00:00Z",
    })

    expect(result).toBe(true)
  })

  it("should return true when there is no lastUpdatePromptAt date and profile is incomplete", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: undefined,
      profession: undefined,
      lastUpdatePromptAt: undefined,
    })

    expect(result).toBe(true)
  })
})

describe("userShouldBePromptedToAddArtistsToCollection", () => {
  it("should prompt the user when artworks and artists count are zero and cooldown period has passed", () => {
    const result = userShouldBePromptedToAddArtistsToCollection({
      artworksCount: 0,
      artistsCount: 0,
      lastUpdatePromptAt: "2024-07-01T00:00:00Z",
    })

    expect(result).toBe(true)
  })

  it("should not prompt the user when artworks and artists count are zero but cooldown period has not passed", () => {
    const result = userShouldBePromptedToAddArtistsToCollection({
      artworksCount: 0,
      artistsCount: 0,
      lastUpdatePromptAt: "2024-08-15T00:00:00Z",
    })

    expect(result).toBe(false)
  })

  it("should not prompt the user when artworks and artists count are greater than zero even if cooldown period has passed", () => {
    const result = userShouldBePromptedToAddArtistsToCollection({
      artworksCount: 1,
      artistsCount: 1,
      lastUpdatePromptAt: "2024-07-01T00:00:00Z",
    })

    expect(result).toBe(false)
  })

  it("should prompt the user when both artworks and artists count are zero and lastUpdatePromptAt is undefined", () => {
    const result = userShouldBePromptedToAddArtistsToCollection({
      artworksCount: 0,
      artistsCount: 0,
      lastUpdatePromptAt: undefined,
    })

    expect(result).toBe(true)
  })
})

describe("userHasNotBeenPromptedWithinCooldownPeriod", () => {
  it("should return true when lastUpdatePromptAt is undefined", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: undefined,
      profession: undefined,
      lastUpdatePromptAt: undefined,
    })

    expect(result).toBe(true)
  })

  it("should return true when the cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: undefined,
      profession: undefined,
      lastUpdatePromptAt: "2024-07-01T00:00:00Z",
    })

    expect(result).toBe(true)
  })

  it("should return false when the cooldown period has not passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      city: undefined,
      profession: undefined,
      lastUpdatePromptAt: "2024-08-15T00:00:00Z",
    })

    expect(result).toBe(false)
  })
})
