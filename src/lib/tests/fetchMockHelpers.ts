import { MockResponseInit } from "jest-fetch-mock/types"

export const fetchMockResponseOnce = (response: MockResponseInit | string) =>
  fetchMock.mockResponseOnce(() => new Promise((res) => res(response)))
