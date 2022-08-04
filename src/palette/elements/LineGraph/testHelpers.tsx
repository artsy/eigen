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
    { x: 0, y: 2, xHighlight: 4, yHighlight: 0 },
    { x: 1, y: 2, xHighlight: 5, yHighlight: 0 },
    { x: 2, y: 3, xHighlight: 7, yHighlight: 0 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
    { x: 6, y: 4 },
    { x: 7, y: 7 },
  ],
  dataMeta: {
    title: "$25,000",
    description: "A description",
    text: "Some random texts that we can use to talk more about what this graph represents",
    tintColor: "#441bb4",
  },
}

// [
//   {
//     label: "Prints",
//     values: [
//       { x: 0, y: 2 },
//       { x: 1, y: 2 },
//       { x: 2, y: 3 },
//       { x: 3, y: 5 },
//       { x: 4, y: 4 },
//       { x: 5, y: 7 },
//       { x: 6, y: 4 },
//       { x: 7, y: 5 },
//     ],
//   },
//   {
//     label: "Works on Paper",
//     values: [
//       { x: 0, y: 1 },
//       { x: 1, y: 3 },
//       { x: 2, y: 5 },
//       { x: 3, y: 8 },
//       { x: 4, y: 4 },
//       { x: 5, y: 1 },
//       { x: 6, y: 2 },
//       { x: 7, y: 5 },
//     ],
//   },
// ]
