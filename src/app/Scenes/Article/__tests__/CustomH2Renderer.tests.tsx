import { screen } from "@testing-library/react-native"
import { CustomH2Renderer } from "app/Scenes/Article/CustomH2Renderer"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
const mockTDefaultRenderer = jest.fn().mockReturnValue(<Text>Default H2 Content</Text>)

jest.mock("app/Components/ArtistFollowButton", () => ({
  ArtistFollowButtonQueryRenderer: jest.fn(),
}))

jest.mock("app/Components/PartnerFollowButton", () => ({
  PartnerFollowButtonQueryRenderer: jest.fn(),
}))

const mockArtistFollowButtonQueryRenderer = jest.mocked(
  require("app/Components/ArtistFollowButton").ArtistFollowButtonQueryRenderer
)
const mockPartnerFollowButtonQueryRenderer = jest.mocked(
  require("app/Components/PartnerFollowButton").PartnerFollowButtonQueryRenderer
)

const createMockCustomRendererProps = (tnode: any) =>
  ({
    TDefaultRenderer: mockTDefaultRenderer,
    tnode,
    InternalRenderer: jest.fn(),
    TNodeChildrenRenderer: jest.fn(),
    sharedProps: {},
    style: {},
    textProps: {},
    viewProps: {},
    type: "block" as const,
    renderIndex: 0,
    renderLength: 1,
  }) as any

describe("CustomH2Renderer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockArtistFollowButtonQueryRenderer.mockReturnValue(<Text>Artist Follow Button</Text>)
    mockPartnerFollowButtonQueryRenderer.mockReturnValue(<Text>Partner Follow Button</Text>)
  })

  it("renders default renderer when no href is provided", () => {
    const tnode = createMockTNode()

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
  })

  it("renders default renderer when href is malformed", () => {
    const tnode = createMockTNode("invalid-url")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
  })

  it("renders default renderer when href does not contain entity and id", () => {
    const tnode = createMockTNode("https://artsy.net/some")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
  })

  it("renders artist follow button when href contains artist entity", () => {
    const tnode = createMockTNode("https://artsy.net/artist/banksy")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
    expect(screen.getByText("Artist Follow Button")).toBeTruthy()
    expect(mockArtistFollowButtonQueryRenderer).toHaveBeenCalledWith(
      expect.objectContaining({ artistID: "banksy" }),
      undefined
    )
  })

  it("renders partner follow button when href contains partner entity", () => {
    const tnode = createMockTNode("https://artsy.net/partner/gagosian")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
    expect(screen.getByText("Partner Follow Button")).toBeTruthy()
    expect(mockPartnerFollowButtonQueryRenderer).toHaveBeenCalledWith(
      expect.objectContaining({ partnerID: "gagosian" }),
      undefined
    )
  })

  it("renders default renderer when entity is not artist or partner", () => {
    const tnode = createMockTNode("/artwork/some-artwork-id")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
  })

  it("handles complex href paths correctly", () => {
    const tnode = createMockTNode("https://artsy.net/some/prefix/artist/jean-michel-basquiat")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
    expect(mockArtistFollowButtonQueryRenderer).not.toHaveBeenCalled()
  })

  it("handles href with domain correctly", () => {
    const tnode = createMockTNode("https://artsy.net/artist/kaws")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
    expect(screen.getByText("Artist Follow Button")).toBeTruthy()
    expect(mockArtistFollowButtonQueryRenderer).toHaveBeenCalledWith(
      expect.objectContaining({ artistID: "kaws" }),
      undefined
    )
  })

  it("renders default renderer when isBigH2 is true with artist link", () => {
    const tnode = createMockTNodeWithComma("https://artsy.net/artist/banksy")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
    expect(mockArtistFollowButtonQueryRenderer).not.toHaveBeenCalled()
  })

  it("renders default renderer when isBigH2 is true with partner link", () => {
    const tnode = createMockTNodeWithComma("https://artsy.net/partner/gagosian")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
    expect(mockPartnerFollowButtonQueryRenderer).not.toHaveBeenCalled()
  })

  it("renders follow button when multiple children but no comma in text", () => {
    const tnode = createMockTNodeWithMultipleChildren("https://artsy.net/artist/banksy")

    renderWithWrappers(<CustomH2Renderer {...createMockCustomRendererProps(tnode)} />)

    expect(mockTDefaultRenderer).toHaveBeenCalled()
    expect(screen.getByText("Default H2 Content")).toBeTruthy()
    expect(screen.getByText("Artist Follow Button")).toBeTruthy()
    expect(mockArtistFollowButtonQueryRenderer).toHaveBeenCalledWith(
      expect.objectContaining({ artistID: "banksy" }),
      undefined
    )
  })
})

const createMockTNode = (href?: string) => ({
  init: {
    domNode: {
      type: "tag",
      children: [
        {
          type: "tag",
          parent: null,
          prev: null,
          next: null,
          startIndex: null,
          endIndex: null,
          name: "a",
          attribs: {
            href,
          },
        },
      ],
      attribs: {
        href,
      },
    },
  },
})

const createMockTNodeWithComma = (href?: string) => ({
  init: {
    domNode: {
      type: "tag",
      children: [
        {
          type: "tag",
          parent: null,
          prev: null,
          next: null,
          startIndex: null,
          endIndex: null,
          name: "a",
          attribs: {
            href,
          },
        },
        {
          type: "text",
          parent: null,
          prev: null,
          next: null,
          startIndex: null,
          endIndex: null,
          data: "Artist Name, Gallery Name",
        },
      ],
      attribs: {
        href,
      },
    },
  },
})

const createMockTNodeWithMultipleChildren = (href?: string) => ({
  init: {
    domNode: {
      type: "tag",
      children: [
        {
          type: "tag",
          parent: null,
          prev: null,
          next: null,
          startIndex: null,
          endIndex: null,
          name: "a",
          attribs: {
            href,
          },
        },
        {
          type: "text",
          parent: null,
          prev: null,
          next: null,
          startIndex: null,
          endIndex: null,
          data: "Artist Name",
        },
      ],
      attribs: {
        href,
      },
    },
  },
})
