import { SpacingUnit as NumberSpacingUnit } from "@artsy/palette-tokens"
import {
  BottomProps,
  LeftProps,
  PositionProps as OGPositionProps,
  RightProps,
  SpaceProps as OGSpaceProps,
  TopProps,
  ZIndexProps,
} from "styled-system"

type ToString<N extends number> = `${N}`
type ToNegative<S extends string> = `-${S}`

type Percentage<N extends number = number> = `${N}%`

export type SpacingUnit =
  | number // pixels
  | ToString<NumberSpacingUnit> // from our design system
  | ToNegative<ToString<NumberSpacingUnit>> // from our design system
  | "auto" // stays as is
  | Percentage // stays as is

export type SpaceProps = OGSpaceProps<{}, SpacingUnit>

export interface PositionProps
  extends ZIndexProps,
    TopProps<{}, SpacingUnit>,
    RightProps<{}, SpacingUnit>,
    BottomProps<{}, SpacingUnit>,
    LeftProps<{}, SpacingUnit> {
  position?: OGPositionProps["position"]
}
