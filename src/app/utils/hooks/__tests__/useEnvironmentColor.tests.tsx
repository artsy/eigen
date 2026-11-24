import { renderHook } from "@testing-library/react-native"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { isRunningPreviewBundle } from "app/system/devTools/DevMenu/utils/previewPR"
import { useEnvironmentColor } from "app/utils/hooks/useEnvironmentColor"

jest.mock("app/system/devTools/DevMenu/utils/previewPR", () => ({
  isRunningPreviewBundle: jest.fn(),
}))

const mockIsRunningPreviewBundle = isRunningPreviewBundle as jest.Mock

describe("useEnvironmentColor", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GlobalStoreProvider>{children}</GlobalStoreProvider>
  )

  const setUp = async ({ preview, staging }: { preview: boolean; staging: boolean }) => {
    mockIsRunningPreviewBundle.mockReturnValue(preview)
    __globalStoreTestUtils__?.injectState({
      devicePrefs: { environment: { env: staging ? "staging" : "production" } },
    })

    const { result } = await renderHook(useEnvironmentColor, { wrapper })
    return result.current
  }

  it("is orange while a preview bundle runs", async () => {
    expect(await setUp({ preview: true, staging: false })).toBe("orange100")
  })

  it("is purple on staging", async () => {
    expect(await setUp({ preview: false, staging: true })).toBe("devpurple")
  })

  it("prefers the preview colour when both are on", async () => {
    expect(await setUp({ preview: true, staging: true })).toBe("orange100")
  })

  it("is null in production", async () => {
    expect(await setUp({ preview: false, staging: false })).toBeNull()
  })
})
