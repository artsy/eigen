import { LineChartData } from "./types"

export const _AVAILABLE_MEDIUMS = [
  "Drawing, Collage, or other Work on paper",
  "Textile Arts",
  "Video/Film/Animation",
  "Painting",
  "Photography",
  "Print",
  "Sculpture",
]

export const testChartData: LineChartData = {
  data: [
    { x: 1998, y: 2, highlight: { x: false, y: false } },
    { x: 1999, y: 2, highlight: { x: false, y: false } },
    { x: 2000, y: 3, highlight: { x: true, y: false } },
    { x: 2001, y: 5, highlight: { x: false, y: false } },
    { x: 2002, y: 4, highlight: { x: true, y: false } },
    { x: 2003, y: 7, highlight: { x: false, y: false } },
    { x: 2004, y: 4, highlight: { x: true, y: false } },
    { x: 2006, y: 7, highlight: { x: false, y: false } },
  ],
  dataMeta: {
    title: "$25,000",
    description: "A description",
    text: "Some random texts that we can use to talk more about what this graph represents",
    tintColor: "#441bb4",
  },
}
