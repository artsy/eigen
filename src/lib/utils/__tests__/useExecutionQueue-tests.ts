import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import React from "react"
import { create } from "react-test-renderer"
import { useExecutionQueue } from "../useExecutionQueue"

describe(useExecutionQueue, () => {
  let queue: ReturnType<typeof useExecutionQueue> | null = null
  beforeEach(() => {
    const TestComponent = () => {
      queue = useExecutionQueue()
      return null
    }
    create(React.createElement(TestComponent))
  })
  it("prevents async tasks from overlapping", async () => {
    let resolveTask1 = () => null
    let startedTask1 = false
    let finishedTask1 = false
    let startedTask2 = false

    // task 1
    queue?.executeInQueue(
      async () =>
        await new Promise(resolve => {
          startedTask1 = true
          resolveTask1 = () => {
            resolve()
            finishedTask1 = true
            return null
          }
        })
    )

    expect(startedTask1).toBe(true)
    expect(finishedTask1).toBe(false)

    // task 2
    queue?.executeInQueue(async () => {
      startedTask2 = true
    })

    expect(startedTask2).toBe(false)
    expect(finishedTask1).toBe(false)

    resolveTask1()
    expect(finishedTask1).toBe(true)
    expect(startedTask2).toBe(false)

    await flushPromiseQueue()

    expect(startedTask2).toBe(true)
  })
})
