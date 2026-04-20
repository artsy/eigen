import { renderHook } from "@testing-library/react-native"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { useArtworkDimensions } from "app/utils/hooks/useArtworkDimensions"

describe("useArtworkDimensions", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "in" } })
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })
  })

  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  describe("with no dimensions", () => {
    it("returns null for all dimension texts", () => {
      const { result } = renderHook(
        () => useArtworkDimensions({ dimensions: null, framedDimensions: null }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBeNull()
      expect(result.current.regularDimensionText).toBeNull()
      expect(result.current.framedDimensionText).toBeNull()
      expect(result.current.hasFramedDimensions).toBe(false)
      expect(result.current.isUsingFramedDimensions).toBe(false)
      expect(result.current.isFramedSizeEnabled).toBe(false)
    })
  })

  describe("with only regular dimensions", () => {
    const dimensions = { in: "20 × 24 in", cm: "50.8 × 61 cm" }

    it("returns formatted dimensions in both-metrics format (default)", () => {
      const { result } = renderHook(
        () => useArtworkDimensions({ dimensions, framedDimensions: null }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
      expect(result.current.regularDimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
      expect(result.current.framedDimensionText).toBeNull()
      expect(result.current.hasFramedDimensions).toBe(false)
      expect(result.current.isUsingFramedDimensions).toBe(false)
    })

    it("returns formatted dimensions in preferred-metric format", () => {
      const { result } = renderHook(
        () =>
          useArtworkDimensions({ dimensions, framedDimensions: null, format: "preferred-metric" }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("20 × 24 in")
      expect(result.current.regularDimensionText).toBe("20 × 24 in")
    })
  })

  describe("with regular and framed dimensions", () => {
    const dimensions = { in: "20 × 24 in", cm: "50.8 × 61 cm" }
    const framedDimensions = { in: "24 × 28 in", cm: "61 × 71.1 cm" }

    describe("when feature flag is disabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: false })
      })

      it("returns regular dimensions only", () => {
        const { result } = renderHook(
          () => useArtworkDimensions({ dimensions, framedDimensions }),
          { wrapper }
        )

        expect(result.current.dimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
        expect(result.current.regularDimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
        expect(result.current.framedDimensionText).toBe("24 × 28 in | 61 × 71.1 cm")
        expect(result.current.hasFramedDimensions).toBe(true)
        expect(result.current.isUsingFramedDimensions).toBe(false)
        expect(result.current.isFramedSizeEnabled).toBe(false)
      })
    })

    describe("when feature flag is enabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })
      })

      it("returns framed dimensions as dimensionText and both separately", () => {
        const { result } = renderHook(
          () => useArtworkDimensions({ dimensions, framedDimensions }),
          { wrapper }
        )

        expect(result.current.dimensionText).toBe("24 × 28 in | 61 × 71.1 cm")
        expect(result.current.regularDimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
        expect(result.current.framedDimensionText).toBe("24 × 28 in | 61 × 71.1 cm")
        expect(result.current.hasFramedDimensions).toBe(true)
        expect(result.current.isUsingFramedDimensions).toBe(true)
        expect(result.current.isFramedSizeEnabled).toBe(true)
      })

      it("includes 'with frame included' text when includeFrameText is true", () => {
        const { result } = renderHook(
          () => useArtworkDimensions({ dimensions, framedDimensions, includeFrameText: true }),
          { wrapper }
        )

        expect(result.current.dimensionText).toBe("24 × 28 in | 61 × 71.1 cm with frame included")
        expect(result.current.framedDimensionText).toBe(
          "24 × 28 in | 61 × 71.1 cm with frame included"
        )
      })

      it("works with preferred-metric format", () => {
        const { result } = renderHook(
          () => useArtworkDimensions({ dimensions, framedDimensions, format: "preferred-metric" }),
          { wrapper }
        )

        expect(result.current.dimensionText).toBe("24 × 28 in")
        expect(result.current.regularDimensionText).toBe("20 × 24 in")
        expect(result.current.framedDimensionText).toBe("24 × 28 in")
      })
    })
  })

  describe("with missing framed dimensions data", () => {
    const dimensions = {
      in: "20 × 24 in",
      cm: "50.8 × 61 cm",
    }

    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })
    })

    it("returns regular dimensions when framedDimensions is null", () => {
      const { result } = renderHook(
        () => useArtworkDimensions({ dimensions, framedDimensions: null }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
      expect(result.current.regularDimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
      expect(result.current.framedDimensionText).toBeNull()
      expect(result.current.hasFramedDimensions).toBe(false)
      expect(result.current.isUsingFramedDimensions).toBe(false)
    })

    it("returns regular dimensions when framedDimensions has no values", () => {
      const { result } = renderHook(
        () => useArtworkDimensions({ dimensions, framedDimensions: { in: null, cm: null } }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("20 × 24 in | 50.8 × 61 cm")
      expect(result.current.hasFramedDimensions).toBe(false)
      expect(result.current.isUsingFramedDimensions).toBe(false)
    })
  })

  describe("with partial dimension data", () => {
    it("handles only inches in regular dimensions", () => {
      const { result } = renderHook(
        () =>
          useArtworkDimensions({
            dimensions: { in: "20 × 24 in", cm: null },
            framedDimensions: null,
          }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("20 × 24 in")
    })

    it("handles only centimeters in regular dimensions", () => {
      const { result } = renderHook(
        () =>
          useArtworkDimensions({
            dimensions: { in: null, cm: "50.8 × 61 cm" },
            framedDimensions: null,
          }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("50.8 × 61 cm")
    })

    it("handles only inches in framed dimensions when flag is enabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworksFramedSize: true })

      const { result } = renderHook(
        () =>
          useArtworkDimensions({
            dimensions: { in: "20 × 24 in", cm: "50.8 × 61 cm" },
            framedDimensions: { in: "24 × 28 in", cm: null },
          }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("24 × 28 in")
      expect(result.current.framedDimensionText).toBe("24 × 28 in")
    })
  })

  describe("with different user metric preferences", () => {
    const dimensions = { in: "20 × 24 in", cm: "50.8 × 61 cm" }

    it("uses centimeters when user prefers cm", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "cm" } })

      const { result } = renderHook(
        () =>
          useArtworkDimensions({ dimensions, framedDimensions: null, format: "preferred-metric" }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("50.8 × 61 cm")
    })

    it("uses inches when user prefers in", () => {
      __globalStoreTestUtils__?.injectState({ userPrefs: { metric: "in" } })

      const { result } = renderHook(
        () =>
          useArtworkDimensions({ dimensions, framedDimensions: null, format: "preferred-metric" }),
        { wrapper }
      )

      expect(result.current.dimensionText).toBe("20 × 24 in")
    })
  })
})
