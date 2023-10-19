import mockFetch from "jest-fetch-mock"
import { safeFetch } from "./safeFetch"

describe("safeFetch", () => {
  beforeAll(() => {
    mockFetch.resetMocks()
  })

  it("should fetch data from a URL", async () => {
    mockFetch.mockResponseOnce(
      JSON.stringify({ userId: 1, id: 1, title: "delectus aut autem", completed: false })
    )

    const data = await safeFetch({ url: "https://jsonplaceholder.typicode.com/todos/1" })

    expect(data).toHaveProperty("userId", 1)
    expect(data).toHaveProperty("id", 1)
    expect(data).toHaveProperty("title", "delectus aut autem")
    expect(data).toHaveProperty("completed", false)
  })

  it("should handle errors", async () => {
    mockFetch.mockRejectOnce(new Error("Failed to fetch data"))

    const onError = jest.fn()
    const sentryMessage = "Failed to fetch data"
    const url = "https://jsonplaceholder.typicode.com/invalid-url"

    await expect(safeFetch({ url, sentryMessage, onError })).rejects.toThrowError()
    expect(onError).toHaveBeenCalled()
  })

  it("should call onComplete callback on success", async () => {
    mockFetch.mockResponseOnce(
      JSON.stringify({ userId: 1, id: 1, title: "delectus aut autem", completed: false })
    )

    const onComplete = jest.fn()
    await safeFetch({ url: "https://jsonplaceholder.typicode.com/todos/1", onComplete })
    expect(onComplete).toHaveBeenCalledWith({
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    })
  })

  it("should not call onComplete callback on error", async () => {
    mockFetch.mockRejectOnce(new Error("Failed to fetch data"))

    const onComplete = jest.fn()
    const sentryMessage = "Failed to fetch data"
    const url = "https://jsonplaceholder.typicode.com/invalid-url"

    await expect(safeFetch({ url, sentryMessage, onComplete })).rejects.toThrowError()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it("should return the correct data type", async () => {
    mockFetch.mockResponseOnce(
      JSON.stringify({ userId: 1, id: 1, title: "delectus aut autem", completed: false })
    )

    const data = await safeFetch({
      url: "https://jsonplaceholder.typicode.com/todos/1",
    })

    expect(data).toHaveProperty("userId", 1)
    expect(data).toHaveProperty("id", 1)
    expect(data).toHaveProperty("title", "delectus aut autem")
    expect(data).toHaveProperty("completed", false)
  })
})
