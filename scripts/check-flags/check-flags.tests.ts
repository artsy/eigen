import { parseHiddenFlags, parseReleasedFlags } from "./check-flags"

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
      const releasedFlags = parseReleasedFlags(flagContent)
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
      const releasedFlags = parseReleasedFlags(flagContent)
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
      const releasedFlags = parseReleasedFlags(flagContent)
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
      const releasedFlags = parseReleasedFlags(flagContent)
      expect(releasedFlags).toEqual(["AROptionsArtistSeries", "AROptionsNewFirstInquiry"])
    })
  })
  describe("hidden flags parsing", () => {
    it("defaults to returning all flags", () => {
      const releasedFlags = []
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
      const hiddenFlags = parseHiddenFlags(flagContent, releasedFlags)
      expect(hiddenFlags).toEqual(["AROptionsArtistSeries", "AROptionsBidManagement", "AROptionsNewFirstInquiry"])
    })

    it("excludes released flags from the results", () => {
      const releasedFlags = ["AROptionsArtistSeries", "AROptionsNewFirstInquiry"]
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
      const hiddenFlags = parseHiddenFlags(flagContent, releasedFlags)
      expect(hiddenFlags).toEqual(["AROptionsBidManagement"])
    })
  })
})
