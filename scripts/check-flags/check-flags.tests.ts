import { parseAllFlags } from "./check-flags"

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
        AROptionsNewFirstInquiry: {
          readyForRelease: true,
          echoFlagKey: "AROptionsNewFirstInquiry",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsBidManagement", "AROptionsArtistSeries", "AROptionsNewFirstInquiry"])
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
        AROptionsNewFirstInquiry: {
          readyForRelease: true,
          echoFlagKey: "AROptionsNewFirstInquiry",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsBidManagement", "AROptionsNewFirstInquiry"])
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
        AROptionsNewFirstInquiry: {
          readyForRelease: true,
          echoFlagKey: "AROptionsNewFirstInquiry",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsArtistSeries", "AROptionsNewFirstInquiry"])
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
        AROptionsNewFirstInquiry: {
          readyForRelease: true,
          echoFlagKey: "AROptionsNewFirstInquiry",
        },
      `
      const releasedFlags = parseAllFlags(flagContent)[1]
      expect(releasedFlags).toEqual(["AROptionsArtistSeries", "AROptionsNewFirstInquiry"])
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
        AROptionsNewFirstInquiry: {
          readyForRelease: true,
          echoFlagKey: "AROptionsNewFirstInquiry",
        },
      `
      const hiddenFlags = parseAllFlags(flagContent)[0]
      expect(hiddenFlags).toEqual(["AROptionsBidManagement"])
    })
  })
})
