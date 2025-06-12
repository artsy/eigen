import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { GalleriesForYouScreen } from "app/Scenes/GalleriesForYou/GalleriesForYouScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success, _) => {
    success({ coords: { latitude: 52, longitude: 23 } })
  }),
  requestAuthorization: jest.fn(),
}))

describe("GalleriesForYouScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: GalleriesForYouScreen,
  })

  it("renders GalleriesForYou", async () => {
    renderWithRelay({
      Query: () => ({
        partnersConnection,
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("PlaceholderGrid"))

    expect(screen.getAllByText("Galleries for You")).toBeTruthy()
    expect(
      screen.queryByText("Find galleries in your area with artists you follow.")
    ).toBeOnTheScreen()

    expect(screen.queryByText("GALERIA AZUR")).toBeOnTheScreen()
    expect(screen.queryByText("Gallery Fedorova")).toBeOnTheScreen()

    expect(screen.queryByText("Nearest City and 2 more locations")).toBeOnTheScreen()
  })
})

const partnersConnection = {
  totalCount: 87,
  edges: [
    {
      node: {
        internalID: "5fd142d03c3bee6f46b8fe0d",
        name: "GALERIA AZUR",
        initials: "GA",
        locationsConnection: {
          edges: [
            {
              node: {
                city: "Potsdam",
                coordinates: {
                  lat: 53,
                  lng: 22,
                },
                id: "TG9jYXRpb246NjA0OGJmOGYyZmIxMTgwMDEyY2Y3NjZh",
              },
            },
            {
              node: {
                city: "Nearest City",
                coordinates: {
                  lat: 52,
                  lng: 23,
                },
                id: "TG9jYXRpb246NjA0OGJmOGYyZmIxMTgwMDEyY2Y3NjZh",
              },
            },
            {
              node: {
                city: "Ciudad autónoma de Buenos Aires",
                coordinates: {
                  lat: 20,
                  lng: 32,
                },
                id: "TG9jYXRpb246NjA0OGMwNDhmMWM1ZWQwMDBlZDIxMjA1",
              },
            },
          ],
        },
        profile: {
          id: "UHJvZmlsZTo1ZmQxNDJkMDNjM2JlZTZmNDZiOGZlMGU=",
          internalID: "5fd142d03c3bee6f46b8fe0e",
          isFollowed: false,
          image: null,
        },
        id: "UGFydG5lcjo1ZmQxNDJkMDNjM2JlZTZmNDZiOGZlMGQ=",
        __typename: "Partner",
      },
      cursor: "YXJyYXljb25uZWN0aW9uOjA=",
    },
    {
      node: {
        internalID: "5f21ea2054e0b50015b24a0b",
        name: "Gallery Fedorova",
        initials: "GF",
        locationsConnection: {
          edges: [
            { node: { city: "Berlin", id: "TG9jYXRpb246NWYyNDJjNGQ2MTEzZDEwMDEyZGFlYWFi" } },
            { node: { city: "Potsdam", id: "TG9jYXRpb246NWY2NDgzMzk3YzBiMzgwMDEzYjlkNjRi" } },
            { node: { city: "Berlin", id: "TG9jYXRpb246NjE0NzE0ZjMxOWI0ZGMwMDBjOTcyMGIy" } },
          ],
        },
        profile: {
          id: "UHJvZmlsZTo1ZjIxZWEyMDU0ZTBiNTAwMTViMjRhMGM=",
          internalID: "5f21ea2054e0b50015b24a0c",
          isFollowed: false,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/HGiZoW22H1TqkvkH2CRoow/wide.jpg",
          },
        },
        id: "UGFydG5lcjo1ZjIxZWEyMDU0ZTBiNTAwMTViMjRhMGI=",
        __typename: "Partner",
      },
      cursor: "YXJyYXljb25uZWN0aW9uOjE=",
    },
    {
      node: {
        internalID: "5242ed77b504f50afc000075",
        name: "Zilberman Gallery",
        initials: "ZG",
        locationsConnection: {
          edges: [
            { node: { city: "Istanbul", id: "TG9jYXRpb246NTI0NGFkMjYxMzliMjExZTA3MDAwMTE4" } },
            { node: { city: "Berlin", id: "TG9jYXRpb246NTcwZTA4Zjk4YjNiODEzMDJhMDAwNDJm" } },
            { node: { city: "Istanbul", id: "TG9jYXRpb246NjFjNmY4NTk5ZmE0ODYwMDBlZjYzYTUz" } },
            { node: { city: "Berlin", id: "TG9jYXRpb246NjQ3MGJkNjgxMzAxMjIwMDBiZTg1MDA1" } },
          ],
        },
        profile: {
          id: "UHJvZmlsZTo1MjQyZWQ3N2I1MDRmNTBhZmMwMDAwNzc=",
          internalID: "5242ed77b504f50afc000077",
          isFollowed: false,
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/ZwDVsCZXRVwkqJp9ZrAQ5w/square.jpg",
          },
        },
        id: "UGFydG5lcjo1MjQyZWQ3N2I1MDRmNTBhZmMwMDAwNzU=",
        __typename: "Partner",
      },
      cursor: "YXJyYXljb25uZWN0aW9uOjI=",
    },
  ],
  pageInfo: { endCursor: "YXJyYXljb25uZWN0aW9uOjk=", hasNextPage: false },
}
