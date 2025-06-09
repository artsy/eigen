import { ExecutionQueue } from "app/utils/ExecutionQueue"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"

describe(ExecutionQueue, () => {
  it("prevents async tasks from overlapping", async () => {
    const queue = new ExecutionQueue()
    let resolveTask1 = () => null
    let startedTask1 = false
    let finishedTask1 = false
    let startedTask2 = false

    // task 1
    queue?.executeInQueue(
      async () =>
        await new Promise<void>((resolve) => {
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
