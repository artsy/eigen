import { SpacingUnit as NumberSpacingUnit } from "@artsy/palette-tokens"
import { SpaceProps as OGSpaceProps } from "styled-system"

type ToString<N extends number> = `${N}`
type ToNegative<S extends string> = `-${S}`

// number for pixels, NumberSpacingUnit string for our design system
export type SpacingUnit = number | ToString<NumberSpacingUnit> | ToNegative<ToString<NumberSpacingUnit>> | "auto"

export type SpaceProps = OGSpaceProps<{}, SpacingUnit>
