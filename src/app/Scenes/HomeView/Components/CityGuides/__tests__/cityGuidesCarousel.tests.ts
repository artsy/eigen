import {
  canLoop,
  distanceFromPosition,
  getInitialIndex,
  getLoopedLength,
} from "app/Scenes/HomeView/Components/CityGuides/cityGuidesCarousel"

describe("cityGuidesCarousel", () => {
  describe("looping", () => {
    it("loops from two cards on", () => {
      expect(canLoop(1)).toBe(false)
      expect(canLoop(2)).toBe(true)
    })

    it("repeats the cards and starts on the first card of the middle copy", () => {
      const length = getLoopedLength(6)
      const initialIndex = getInitialIndex(6)

      expect(length).toBeGreaterThan(6)
      expect(initialIndex % 6).toBe(0)
      expect(initialIndex).toBe(length / 2)
    })

    it("doesn't repeat a single card", () => {
      expect(getLoopedLength(1)).toBe(1)
      expect(getInitialIndex(1)).toBe(0)
    })
  })

  describe("distanceFromPosition", () => {
    it("measures straight distance when not looping", () => {
      expect(distanceFromPosition(0, 0, 1, false)).toBe(0)
      expect(distanceFromPosition(2.5, 1, 4, false)).toBe(1.5)
    })

    it("counts a card's repeats when looping", () => {
      // Position 600 is card 0 of a 6-card rail
      expect(distanceFromPosition(600, 0, 6, true)).toBe(0)
      // ...so card 5 sits right before it, wrapping around
      expect(distanceFromPosition(600, 5, 6, true)).toBe(1)
      expect(distanceFromPosition(600, 1, 6, true)).toBe(1)
      expect(distanceFromPosition(600, 3, 6, true)).toBe(3)
    })

    it("is fractional mid-swipe", () => {
      expect(distanceFromPosition(600.3, 0, 6, true)).toBeCloseTo(0.3)
      expect(distanceFromPosition(600.3, 1, 6, true)).toBeCloseTo(0.7)
    })
  })
})
