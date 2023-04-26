import { fireEvent } from "@testing-library/react-native"
import { ShowCardTestsQuery } from "__generated__/ShowCardTestsQuery.graphql"
import { ShowCardContainer, getShowCity } from "app/Components/ShowCard"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

const mockOnPress = jest.fn()
describe("ShowCard", () => {
  const TestRenderer: React.FC = () => {
    const queryData = useLazyLoadQuery<ShowCardTestsQuery>(
      graphql`
        query ShowCardTestsQuery @raw_response_type {
          show(id: "test") {
            ...ShowCard_show
          }
        }
      `,
      {}
    )

    return <ShowCardContainer show={queryData.show!} onPress={mockOnPress} />
  }

  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("navigates to the show page", async () => {
    const { getByText, debug } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Show: () => ({
        href: "/show/berghain-art-show",
        name: "Berghain Art Show",
        city: "Berlin",
        formattedStartAt: "Mar 1",
        formattedEndAt: "Apr 14",
        metaImage: {
          url: "https://d32dm0rphc51dk.cloudfront.net/1Z5Y1Zq1GZ1Y1Zq1GZ/medium.jpg",
        },
        partner: {
          city: "Paris",
        },
      }),
    })

    debug()

    await flushPromiseQueue()

    const button = getByText("Berghain Art Show")
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith("/show/berghain-art-show")
    expect(mockOnPress).toHaveBeenCalled()
  })

  it("renders the show name, data and city ", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Show: () => ({
        href: "/show/berghain-art-show",
        name: "Berghain Art Show",
        city: "Berlin",
        formattedStartAt: "Mar 1",
        formattedEndAt: "Apr 14",
        metaImage: {
          url: "https://d32dm0rphc51dk.cloudfront.net/1Z5Y1Zq1GZ1Y1Zq1GZ/medium.jpg",
        },
        partner: {
          city: "Paris",
        },
      }),
    })

    await flushPromiseQueue()

    const button = getByText("Berghain Art Show")
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith("/show/berghain-art-show")
    expect(mockOnPress).toHaveBeenCalled()
    expect(getByText("Berlin • Mar 1-Apr 14")).toBeTruthy()
  })
})

describe("getShowCity", () => {
  it("returns showCity when a showCity is specifed", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: "Berlin",
        partnerCities: ["New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: "Berlin",
        partnerCities: ["New York", "London"],
        externalPartnerCity: "Paris",
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: "Berlin",
        partnerCities: null,
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
  })

  it("returns city from partner cities when no showCity is specifed", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: null,
        partnerCities: ["Berlin", "New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: ["berlin", "New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual("Berlin")
  })

  it("returns city from external partner city when no showCity is specifed", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: "Berlin",
      })
    ).toEqual("Berlin")
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: "berlin",
      })
    ).toEqual("Berlin")
  })

  it("returns null when no show city is specifed and none of the partner cities are included in the show name", () => {
    expect(
      getShowCity({
        showName: "Berghain Art Show in Berlin",
        showCity: null,
        partnerCities: ["New York", "London"],
        externalPartnerCity: null,
      })
    ).toEqual(null)
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: null,
      })
    ).toEqual(null)
    expect(
      getShowCity({
        showName: "Berghain Art Show in berlin",
        showCity: null,
        partnerCities: null,
        externalPartnerCity: "Paris",
      })
    ).toEqual(null)
  })
})
