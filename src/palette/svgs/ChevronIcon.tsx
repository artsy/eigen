import React from "react"

import { ArrowDownIcon } from "./ArrowDownIcon"
import { ArrowLeftIcon } from "./ArrowLeftIcon"
import { ArrowRightIcon } from "./ArrowRightIcon"
import { ArrowUpIcon } from "./ArrowUpIcon"
import { IconProps } from "./Icon"

type Direction = "left" | "right" | "up" | "down"

// TODO: This is for backwards compat with Volt; need to update there
export enum Rotation {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

const rotationMap = {
  [Rotation.LEFT]: ArrowLeftIcon,
  [Rotation.RIGHT]: ArrowRightIcon,
  [Rotation.UP]: ArrowUpIcon,
  [Rotation.DOWN]: ArrowDownIcon,
}

const directionMap = {
  left: ArrowLeftIcon,
  right: ArrowRightIcon,
  up: ArrowUpIcon,
  down: ArrowDownIcon,
}

interface ChevronProps extends IconProps {
  direction?: Direction | Rotation
}

/** ChevronIcon */
export const ChevronIcon = ({
  direction = "right",
  ...props
}: ChevronProps) => {
  const Arrow = rotationMap[direction] || directionMap[direction]
  return <Arrow {...props} />
}
