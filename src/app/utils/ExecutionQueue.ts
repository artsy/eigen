export class ExecutionQueue {
  isExecuting: boolean = false
  queue: Array<() => Promise<void>> = []

  executeInQueue: <T>(f: () => Promise<T>) => Promise<T> = async (f) => {
    return await new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await f())
        } catch (e) {
          reject(e)
        }
      })
      this.tick()
    })
  }

  tick = async () => {
    if (!this.isExecuting && this.queue.length > 0) {
      const next = this.queue.shift()
      this.isExecuting = true
      try {
        await next?.()
      } finally {
        this.isExecuting = false
        requestAnimationFrame(this.tick)
      }
    }
  }
}
