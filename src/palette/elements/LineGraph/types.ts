// export interface ChartData {
//   x: number
//   y: number
// }

// interface Meta {
//   title?: string
//   description?: string
//   text?: string
// }

// export interface ChartDataWithHighlightedPoints extends ChartData {
//   xHighlight?: number
//   yHighlight?: number
// }

// interface BaseLineChartData {
//   meta?: Meta
// }

// interface LineChartDataWithCategories extends BaseLineChartData {
//   categories: Record<string, Category>
// }

// interface SimpleLineChartDataWithHighlights extends BaseLineChartData {
//   data: ChartDataWithHighlightedPoints[]
// }

// type Only<T, U> = {
//   [P in keyof T]: T[P]
// } & {
//   [P in keyof U]?: never
// }

// type Either<T, U> = Only<T, U> | Only<U, T>

// export type LineChartData = Either<SimpleLineChartDataWithHighlights, LineChartDataWithCategories>

interface ChartData {
  x: number
  y: number
  xHighlight?: number
  yHighlight?: number
}

interface Meta {
  title?: string
  description?: string
  text?: string
  tintColor?: string
  xHighlightIcon?: JSX.Element
  yHighlightIcon?: JSX.Element
}

export interface LineChartData {
  dataMeta: Meta
  data: ChartData[]
}
