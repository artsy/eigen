import { parseAllFlags } from "../check-flags"

describe("check flags script", () => {
  describe("released flags parsing", () => {
    it("parses released flags correctly", () => {
      const flagContent = `
        AROptionsBidManagement: {
          readyForRelease: true,
          echoFlagKey: "AROptionsBidManagement",
        },
        AROptionsArtistSeries: {
          readyForRelease: true,
          echoFlagKey: "AROptionsArtistSeries",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsBidManagement", "AROptionsArtistSeries"])
    })

    it("excludes flags not marked readyForRelease", () => {
      const flagContent = `
        AROptionsBidManagement: {
          readyForRelease: true,
          echoFlagKey: "AROptionsBidManagement",
        },
        AROptionsArtistSeries: {
          readyForRelease: false,
          echoFlagKey: "AROptionsArtistSeries",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsBidManagement"])
    })

    it("excludes flags not including readyForRelease key", () => {
      const flagContent = `
        AROptionsBidManagement: {
          echoFlagKey: "AROptionsBidManagement",
        },
        AROptionsArtistSeries: {
          readyForRelease: true,
          echoFlagKey: "AROptionsArtistSeries",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsArtistSeries"])
    })

    it("doesn't care what order readyForRelease key appears", () => {
      const flagContent = `
        AROptionsArtistSeries: {
          echoFlagKey: "AROptionsArtistSeries",
          readyForRelease: true,
          someOtherKey: "somevalue"
        },
        AROptionsBidManagement: {
          echoFlagKey: "AROptionsBidManagement",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsArtistSeries"])
    })
  })
  describe("hidden flags parsing", () => {
    it("returns hidden flags", () => {
      const flagContent = `
        AROptionsArtistSeries: {
          echoFlagKey: "AROptionsArtistSeries",
          readyForRelease: true,
          someOtherKey: "somevalue"
        },
        AROptionsBidManagement: {
          readyForRelease: false,
          echoFlagKey: "AROptionsBidManagement",
        },
      `
      const hiddenFlags = parseAllFlags(flagContent)[0]
      expect(hiddenFlags).toEqual(["AROptionsBidManagement"])
    })
  })
})
