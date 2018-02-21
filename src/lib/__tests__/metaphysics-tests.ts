jest.mock("react-native", () => ({
  NativeModules: {
    Emission: { userAgent: "Emission" },
  },
}))

import metaphysics from "lib/metaphysics"

declare const global: any
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ data: {} }),
  })
)

it("Adds a user agent for reaction", () => {
  expect.assertions(1)

  return metaphysics("query {}").then(() => {
    expect(global.fetch).toBeCalledWith("https://metaphysics-production.artsy.net", {
      body: '{"query":"query {}"}',
      headers: { "Content-Type": "application/json", "User-Agent": "Emission" },
      method: "POST",
    })
  })
})
