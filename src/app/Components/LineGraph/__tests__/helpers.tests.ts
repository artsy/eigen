import { shadeColor } from "app/Components/LineGraph/helpers"

const hexRegex = new RegExp(/^#(?:[A-Fa-f0-9]{3}){1,2}$/)
const rgbRegex = new RegExp(
  /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/
)
const isValidRGBColor = (color: string) => rgbRegex.test(color)

const isValidHexColor = (color: string) => hexRegex.test(color)

const isValidColor = (color: string) => hexRegex.test(color) || rgbRegex.test(color)

describe("LineGraphHelpers", () => {
  describe(shadeColor, () => {
    it("returns a valid color", () => {
      const color = "#44CCBB"
      const shadeFactor = 0.8
      const lightenedColor = shadeColor(color, shadeFactor)
      expect(isValidColor(lightenedColor)).toBe(true)
    })

    it("when given rgb, return a valid rgb color", () => {
      const color = "rgb(255,255,0)"
      const shadeFactor = 0.8
      const lightenedColor = shadeColor(color, shadeFactor)
      expect(isValidRGBColor(lightenedColor)).toBe(true)
      expect(isValidHexColor(lightenedColor)).toBe(false)
    })

    it("when given hex, return a valid hex color", () => {
      const color = "#44CCBB"
      const shadeFactor = 0.8
      const lightenedColor = shadeColor(color, shadeFactor)
      expect(isValidRGBColor(lightenedColor)).toBe(false)
      expect(isValidHexColor(lightenedColor)).toBe(true)
    })

    it("Does not shade non colors", () => {
      const color = "#NOTACOLOR"
      const shadeFactor = 0.8
      const lightenedColor = shadeColor(color, shadeFactor)
      expect(lightenedColor).toEqual(color)
    })
  })
})
