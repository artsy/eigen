import {
  userShouldBePromptedToCompleteProfile,
  userShouldBePromptedToAddArtistsToCollection,
} from "app/utils/collectorPromptHelpers"

describe("userShouldBePromptedToCompleteProfile", () => {
  it("should prompt the user when location and profession are missing and cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      locationDisplay: "",
      profession: undefined,
      lastUpdatePromptAt: daysAgo(60),
    })

    expect(result).toBe(true)
  })

  it("should not prompt the user when location and profession are missing but cooldown period has not passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      locationDisplay: undefined,
      profession: undefined,
      lastUpdatePromptAt: daysAgo(15),
    })

    expect(result).toBe(false)
  })

  it("should not prompt the user when location and profession are provided even if cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      locationDisplay: "New York",
      profession: "Artist",
      lastUpdatePromptAt: daysAgo(45),
    })

    expect(result).toBe(false)
  })

  it("should prompt the user when profession is missing and cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      locationDisplay: "New York",
      profession: undefined,
      lastUpdatePromptAt: daysAgo(45),
    })

    expect(result).toBe(true)
  })

  it("should return true when there is no lastUpdatePromptAt date and profile is incomplete", () => {
    const result = userShouldBePromptedToCompleteProfile({
      locationDisplay: undefined,
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
      lastUpdatePromptAt: daysAgo(45),
    })

    expect(result).toBe(true)
  })

  it("should not prompt the user when artworks and artists count are zero but cooldown period has not passed", () => {
    const result = userShouldBePromptedToAddArtistsToCollection({
      artworksCount: 0,
      artistsCount: 0,
      lastUpdatePromptAt: daysAgo(15),
    })

    expect(result).toBe(false)
  })

  it("should not prompt the user when artworks and artists count are greater than zero even if cooldown period has passed", () => {
    const result = userShouldBePromptedToAddArtistsToCollection({
      artworksCount: 1,
      artistsCount: 1,
      lastUpdatePromptAt: daysAgo(45),
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
      locationDisplay: undefined,
      profession: undefined,
      lastUpdatePromptAt: undefined,
    })

    expect(result).toBe(true)
  })

  it("should return true when the cooldown period has passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      locationDisplay: undefined,
      profession: undefined,
      lastUpdatePromptAt: daysAgo(45),
    })

    expect(result).toBe(true)
  })

  it("should return false when the cooldown period has not passed", () => {
    const result = userShouldBePromptedToCompleteProfile({
      locationDisplay: undefined,
      profession: undefined,
      lastUpdatePromptAt: daysAgo(15),
    })

    expect(result).toBe(false)
  })
})

const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}
