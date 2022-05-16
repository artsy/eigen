import { ReactNativeFile } from "extract-files"
import { RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { GraphQLRequest } from "./types"
import { uploadMiddleware } from "./uploadMiddleware"

describe("uploadMiddleware", () => {
  const mockAppend = jest.fn()

  // @ts-expect-error
  global.FormData = function () {
    // @ts-expect-error
    this.append = mockAppend
  }

  const fileOne = new ReactNativeFile({
    uri: "/path/to/file/filename-one.jpg",
    name: "filename-one.jpg",
    type: "image/jpeg",
  })

  const fileTwo = new ReactNativeFile({
    uri: "/path/to/file/filename-two.jpg",
    name: "filename-two.jpg",
    type: "image/jpeg",
  })

  const relayResponse: RelayNetworkLayerResponse = {
    _res: null,
    ok: true,
    status: 200,
    json: {},
    processJsonData: () => ({}),
    clone: () => relayResponse,
  }

  const middleware = uploadMiddleware()
  const mockNext = jest.fn().mockImplementation(() => Promise.resolve(relayResponse))

  const request: GraphQLRequest = {
    // @ts-ignore
    operation: {
      operationKind: "query",
      text: "",
    },
    variables: {
      file: fileOne,
    },
    fetchOpts: {
      method: "POST",
      body: "",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "user-agent-value",
        "X-USER-ID": "user-id",
        "X-TIMEZONE": "Europe/Berlin",
      },
    },
  }

  beforeEach(() => {
    mockNext.mockClear()
    mockAppend.mockClear()
  })

  it("`body` field is an instance of FormData", () => {
    middleware(mockNext)(request)
    const call = mockNext.mock.calls[0][0]
    const formData = call.fetchOpts.body

    expect(formData).toBeInstanceOf(FormData)
  })

  it("should be appended specific fields for FormData", () => {
    middleware(mockNext)(request)
    const call = mockAppend.mock.calls

    expect(call[0][0]).toBe("operations")
    expect(call[1][0]).toBe("map")

    // File
    expect(call[2][0]).toBe("0")
    expect(call[2][1]).toMatchInlineSnapshot(`
      ReactNativeFile {
        "name": "filename-one.jpg",
        "type": "image/jpeg",
        "uri": "/path/to/file/filename-one.jpg",
      }
    `)
  })

  it("should be possible to specify multiple files", () => {
    const requestWithMultipleFiles: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "query",
        text: "",
      },
      variables: {
        files: [fileOne, fileTwo],
      },
      fetchOpts: {
        method: "POST",
        body: "",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "user-agent-value",
          "X-USER-ID": "user-id",
          "X-TIMEZONE": "Europe/Berlin",
        },
      },
    }

    middleware(mockNext)(requestWithMultipleFiles)
    const call = mockAppend.mock.calls

    expect(call[0][0]).toBe("operations")
    expect(call[1][0]).toBe("map")

    // First file
    expect(call[2][0]).toBe("0")
    expect(call[2][1]).toMatchInlineSnapshot(`
      ReactNativeFile {
        "name": "filename-one.jpg",
        "type": "image/jpeg",
        "uri": "/path/to/file/filename-one.jpg",
      }
    `)

    // Second file
    expect(call[3][0]).toBe("1")
    expect(call[3][1]).toMatchInlineSnapshot(`
      ReactNativeFile {
        "name": "filename-two.jpg",
        "type": "image/jpeg",
        "uri": "/path/to/file/filename-two.jpg",
      }
    `)
  })

  it("should remove `Content-Type` header", () => {
    middleware(mockNext)(request)
    const call = mockNext.mock.calls[0][0]

    expect(call.fetchOpts.headers).toMatchInlineSnapshot(`
      Object {
        "User-Agent": "user-agent-value",
        "X-TIMEZONE": "Europe/Berlin",
        "X-USER-ID": "user-id",
      }
    `)
  })
})
