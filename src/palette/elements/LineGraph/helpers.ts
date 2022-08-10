export enum AxisDisplayType {
  OnlyShowMinAndMaxDomain = "OnlyShowMinAndMaxDomain",
  ShowAllValues = "ShowAllValues",
}

const defaultFormatter = (val: any) => {
  if (isNaN(Number(val))) {
    return val
  }
  const inThousand = Number(val) / 1000
  if (inThousand > 0.99) {
    return Math.ceil(inThousand) + "k"
  }
  return val
}

export const tickFormat = (
  tick: any,
  minDomain: number,
  maxDomain: number,
  formatter: (val: any) => string = defaultFormatter,
  tickFormatType: AxisDisplayType = AxisDisplayType.ShowAllValues
): string => {
  let res = ""
  switch (tickFormatType) {
    case AxisDisplayType.OnlyShowMinAndMaxDomain:
      if (tick === maxDomain || tick === minDomain) {
        res = formatter(tick)
      }
      break
    case AxisDisplayType.ShowAllValues:
      res = formatter(tick)
      break
  }
  return res
}

// Adapted from https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
const shadeHexColor = (color: string, percent: number) => {
  const parsedColor = parseInt(color.slice(1), 16)
  const t = percent < 0 ? 0 : 255
  const p = percent < 0 ? percent * -1 : percent
  // tslint:disable-next-line:no-bitwise
  const R = parsedColor >> 16
  // tslint:disable-next-line:no-bitwise
  const G = (parsedColor >> 8) & 0x00ff
  // tslint:disable-next-line:no-bitwise
  const B = parsedColor & 0x0000ff
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  )
}

const shadeRGBColor = (color: string, percent: number) => {
  const parsedColor = color.split(",")
  const t = percent < 0 ? 0 : 255
  const p = percent < 0 ? percent * -1 : percent
  // tslint:disable-next-line:radix
  const R = parseInt(parsedColor[0].slice(4))
  // tslint:disable-next-line:radix
  const G = parseInt(parsedColor[1])
  // tslint:disable-next-line:radix
  const B = parseInt(parsedColor[2])
  return (
    "rgb(" +
    (Math.round((t - R) * p) + R) +
    "," +
    (Math.round((t - G) * p) + G) +
    "," +
    (Math.round((t - B) * p) + B) +
    ")"
  )
}

/** shadeColor accepts either a hex or rgb color and lightens or darkens it based on supplied percent
 * @param color hex or rgb color string
 * @param percent decimal number between -0 and +1. Negative numbers darkens, positive numbers lightens
 * @returns string
 */
export const shadeColor = (color: string, percent: number): string => {
  const hexRegex = new RegExp(/^#(?:[A-Fa-f0-9]{3}){1,2}$/)
  const rgbRegex = new RegExp(
    /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/
  )
  if (hexRegex.test(color)) {
    return shadeHexColor(color, percent)
  } else if (rgbRegex.test(color)) {
    return shadeRGBColor(color, percent)
  }
  if (__DEV__) {
    console.error(
      `Wrong color ${color} passed to shadeColor. This function only accepts hex or rgb colors`
    )
  }
  return color
}
