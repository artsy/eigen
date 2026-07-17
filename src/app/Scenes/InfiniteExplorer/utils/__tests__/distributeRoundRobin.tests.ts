import { distributeRoundRobin } from "app/Scenes/InfiniteExplorer/utils/distributeRoundRobin"

describe("distributeRoundRobin", () => {
  it("deals items into columns one at a time, starting at column 0", () => {
    const columns = [[], [], []]

    const result = distributeRoundRobin(columns, ["a", "b", "c", "d"])

    expect(result).toEqual([["a", "d"], ["b"], ["c"]])
  })

  it("appends to existing column contents rather than replacing them", () => {
    const columns = [["existing-a"], ["existing-b"]]

    const result = distributeRoundRobin(columns, ["c", "d"])

    expect(result).toEqual([
      ["existing-a", "c"],
      ["existing-b", "d"],
    ])
  })

  it("returns the columns unchanged when there are no new items", () => {
    const columns = [["a"], ["b"]]

    const result = distributeRoundRobin(columns, [])

    expect(result).toBe(columns)
  })

  it("does not mutate the input columns array", () => {
    const columns = [["a"], ["b"]]

    distributeRoundRobin(columns, ["c", "d"])

    expect(columns).toEqual([["a"], ["b"]])
  })

  it("restricts distribution to targetColumnIndexes when given", () => {
    const columns = [[], [], [], []]

    const result = distributeRoundRobin(columns, ["a", "b", "c"], [1, 3])

    expect(result).toEqual([[], ["a", "c"], [], ["b"]])
  })

  it("leaves columns unchanged when targetColumnIndexes is empty", () => {
    const columns = [["a"], ["b"]]

    const result = distributeRoundRobin(columns, ["c"], [])

    expect(result).toBe(columns)
  })

  it("starts dealing from startOffset instead of always column 0", () => {
    const columns = [[], [], [], []]

    const result = distributeRoundRobin(columns, ["a", "b"], undefined, 2)

    expect(result).toEqual([[], [], ["a"], ["b"]])
  })

  it("wraps startOffset around the target list", () => {
    const columns = [[], [], [], []]

    const result = distributeRoundRobin(columns, ["a", "b"], undefined, 3)

    expect(result).toEqual([["b"], [], [], ["a"]])
  })
})
