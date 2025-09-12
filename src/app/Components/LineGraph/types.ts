interface ChartData {
  x: number
  y: number
  highlight?: {
    x?: boolean
    y?: boolean
  }
}

interface Meta {
  title?: string
  description?: string
  text?: string
  tintColor?: string
  xHighlightIcon?: React.JSX.Element
  yHighlightIcon?: React.JSX.Element
}

export interface LineChartData {
  dataMeta: Meta
  data: ChartData[]
}
