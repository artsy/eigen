import { extractNodes } from "app/utils/extractNodes"

describe(extractNodes, () => {
  it(`extracts nodes from a connection`, async () => {
    const connection = {
      edges: [{ node: { char: "A" } }, { node: { char: "B" } }, { node: { char: "C" } }],
    }
    expect(extractNodes(connection)).toEqual([{ char: "A" }, { char: "B" }, { char: "C" }])
  })

  it(`extracts nodes from a connection with a mapping function`, async () => {
    const connection = {
      edges: [{ node: { char: "A" } }, { node: { char: "B" } }, { node: { char: "C" } }],
    }
    expect(extractNodes(connection, (node) => node.char).join("")).toEqual("ABC")
  })

  it(`returns an empty array when things are not there`, async () => {
    expect(extractNodes(undefined)).toEqual([])
    expect(extractNodes(null)).toEqual([])
    expect(extractNodes({ edges: null })).toEqual([])
    expect(extractNodes({ edges: [] })).toEqual([])
    expect(extractNodes({ edges: [null] })).toEqual([])
  })
})
