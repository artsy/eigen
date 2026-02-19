import { act, renderHook, waitFor } from "@testing-library/react-native"
import { useSendInquiryTestQuery } from "__generated__/useSendInquiryTestQuery.graphql"
import { useSendInquiry } from "app/Scenes/Artwork/hooks/useSendInquiry"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { initialArtworkInquiryState } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import * as artworkInquiryStore from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import * as inquiryRequest from "app/utils/mutations/useSubmitInquiryRequest"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/Scenes/Artwork/Components/CommercialButtons/useInquirySuccessPopover", () => ({
  useInquirySuccessPopover: jest.fn(),
}))

const env = createMockEnvironment()

describe("useSendInquiry", () => {
  const dispatch = jest.fn()
  const mockShowPopover = jest.fn()

  beforeEach(() => {
    jest.spyOn(artworkInquiryStore, "useArtworkInquiryContext").mockReturnValue({
      dispatch,
      state: initialArtworkInquiryState,
    })
    jest.spyOn(inquiryRequest as any, "useSubmitInquiryRequest").mockImplementation(() => [
      jest.fn(({ onCompleted }) => {
        onCompleted()
      }),
    ])

    const {
      useInquirySuccessPopover,
    } = require("app/Scenes/Artwork/Components/CommercialButtons/useInquirySuccessPopover")
    useInquirySuccessPopover.mockReturnValue(mockShowPopover)
  })

  afterEach(() => {
    jest.clearAllMocks()
    env.mockClear()
  })

  it("sends an inquiry", async () => {
    const loader = await loaderHook()
    const { result } = renderHook(
      () =>
        useSendInquiry({
          artwork: (loader.current as any).artwork,
          me: (loader.current as any).me,
          onCompleted: jest.fn(),
        }),
      { wrapper }
    )

    act(() => result.current.sendInquiry("message"))

    expect(result.current.error).toBe(false)
    expect(mockTrackEvent).toHaveBeenNthCalledWith(1, {
      action_type: "tap",
      action_name: "inquirySend",
      owner_type: "Artwork",
      owner_id: '<mock-value-for-field-"internalID">',
      owner_slug: '<mock-value-for-field-"slug">',
    })
    expect(mockTrackEvent).toHaveBeenNthCalledWith(2, {
      action_type: "success",
      action_name: "inquirySend",
      owner_type: "Artwork",
      owner_id: '<mock-value-for-field-"internalID">',
      owner_slug: '<mock-value-for-field-"slug">',
    })
    await waitFor(() => expect(mockShowPopover).toHaveBeenCalled())
  })

  it("returns an error when sendInquiry fails", async () => {
    jest.spyOn(inquiryRequest as any, "useSubmitInquiryRequest").mockImplementation(() => [
      jest.fn(({ onError }) => {
        onError()
      }),
    ])

    const loader = await loaderHook()
    const { result } = renderHook(
      () =>
        useSendInquiry({
          artwork: (loader.current as any).artwork,
          me: (loader.current as any).me,
          onCompleted: jest.fn(),
        }),
      { wrapper }
    )

    act(() => result.current.sendInquiry("message"))

    expect(result.current.error).toBe(true)
    expect(mockTrackEvent).toHaveBeenNthCalledWith(1, {
      action_type: "tap",
      action_name: "inquirySend",
      owner_type: "Artwork",
      owner_id: '<mock-value-for-field-"internalID">',
      owner_slug: '<mock-value-for-field-"slug">',
    })
    expect(mockTrackEvent).toHaveBeenNthCalledWith(2, {
      action_type: "fail",
      action_name: "inquirySend",
      owner_type: "Artwork",
      owner_id: '<mock-value-for-field-"internalID">',
      owner_slug: '<mock-value-for-field-"slug">',
    })
  })

  it("dispatches setCollectionPromptVisible given a user without a complete profile and never been prompted", async () => {
    const loader = await loaderHook({
      Me: () => ({
        lastUpdatePromptAt: null,
        location: { display: null },
        collectorProfile: { lastUpdatePromptAt: null },
        myCollectionInfo: { artistsCount: 1, artworksCount: 1 },
      }),
    })

    const { result } = renderHook(
      () =>
        useSendInquiry({
          artwork: (loader.current as any).artwork,
          me: (loader.current as any).me,
          onCompleted: jest.fn(),
        }),
      { wrapper }
    )

    act(() => result.current.sendInquiry("message"))

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: "setProfilePromptVisible",
        payload: true,
      })
    )
  })

  it("shows the collection prompt if the user has no collections and never been prompted", async () => {
    const loader = await loaderHook({
      Me: () => ({
        collectorProfile: { lastUpdatePromptAt: null },
        myCollectionInfo: { artworksCount: 0 },
        userInterestsConnection: { totalCount: 0 },
      }),
    })

    const { result } = renderHook(
      () =>
        useSendInquiry({
          artwork: (loader.current as any).artwork,
          me: (loader.current as any).me,
          onCompleted: jest.fn(),
        }),
      { wrapper }
    )

    act(() => result.current.sendInquiry("message"))

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: "setCollectionPromptVisible",
        payload: true,
      })
    )
  })

  it("shows profile prompt if the user has no collections, no complete profile and never been prompted", async () => {
    const loader = await loaderHook({
      Me: () => ({
        lastUpdatePromptAt: null,
        location: { display: null },
        collectorProfile: { lastUpdatePromptAt: null },
        myCollectionInfo: { artistsCount: 0, artworksCount: 0 },
        userInterestsConnection: { totalCount: 0 },
      }),
    })

    const { result } = renderHook(
      () =>
        useSendInquiry({
          artwork: (loader.current as any).artwork,
          me: (loader.current as any).me,
          onCompleted: jest.fn(),
        }),
      { wrapper }
    )

    act(() => result.current.sendInquiry("message"))

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: "setCollectionPromptVisible",
        payload: true,
      })
    )
  })

  it("does not show any prompt given collection and profile are complete and never been prompted", async () => {
    const loader = await loaderHook({
      Me: () => ({
        collectorProfile: { lastUpdatePromptAt: null },
        myCollectionInfo: { artistsCount: 1, artworksCount: 1 },
      }),
    })

    const { result } = renderHook(
      () =>
        useSendInquiry({
          artwork: (loader.current as any).artwork,
          me: (loader.current as any).me,
          onCompleted: jest.fn(),
        }),
      { wrapper }
    )

    act(() => result.current.sendInquiry("message"))

    await waitFor(() => expect(mockShowPopover).toHaveBeenCalled())
  })

  it("includes selected inquiry questions in the tracking event", async () => {
    jest.spyOn(artworkInquiryStore, "useArtworkInquiryContext").mockReturnValue({
      dispatch,
      state: {
        ...initialArtworkInquiryState,
        inquiryQuestions: [{ questionID: "question_1" }, { questionID: "question_2" }],
      },
    })

    const loader = await loaderHook()
    const { result } = renderHook(
      () =>
        useSendInquiry({
          artwork: loader.current!.artwork,
          me: loader.current!.me,
          onCompleted: jest.fn(),
        }),
      { wrapper }
    )

    act(() => result.current.sendInquiry("message"))

    expect(result.current.error).toBe(false)
    expect(mockTrackEvent).toHaveBeenNthCalledWith(1, {
      action_type: "tap",
      action_name: "inquirySend",
      owner_type: "Artwork",
      owner_id: '<mock-value-for-field-"internalID">',
      owner_slug: '<mock-value-for-field-"slug">',
    })
    expect(mockTrackEvent).toHaveBeenNthCalledWith(2, {
      action_type: "success",
      action_name: "inquirySend",
      owner_type: "Artwork",
      owner_id: '<mock-value-for-field-"internalID">',
      owner_slug: '<mock-value-for-field-"slug">',
      inquiry_checkboxes: ["question_1", "question_2"],
    })
  })
})

const useTestData = () => {
  const data = useLazyLoadQuery<useSendInquiryTestQuery>(
    graphql`
      query useSendInquiryTestQuery {
        me @required(action: NONE) {
          ...useSendInquiry_me
        }
        artwork(id: "artwork-id") @required(action: NONE) {
          ...useSendInquiry_artwork
        }
      }
    `,
    {}
  )

  return data
}

const wrapper = ({ children }: any) => (
  <RelayEnvironmentProvider environment={env}>
    <GlobalStoreProvider>{children}</GlobalStoreProvider>
  </RelayEnvironmentProvider>
)

const loaderHook = async (mock = {}) => {
  act(() => {
    env.mock.queueOperationResolver((operation) => MockPayloadGenerator.generate(operation, mock))
  })
  const { result } = renderHook(() => useTestData(), { wrapper })

  await waitFor(() => expect(result.current).toBeTruthy())

  return result
}
