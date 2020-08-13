import React from "react"
import { color } from "../../helpers"

/**
 * Line is the component responsible for rendering a line that goes through all of the data points
 * in a line chart.
 */
export const Line = ({ path }: { path: string }) => {
  return <path fill="none" stroke={color("black10")} d={path} />
}
