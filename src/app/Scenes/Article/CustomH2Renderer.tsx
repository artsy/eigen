import { Flex } from "@artsy/palette-mobile"
import { ArtistFollowButtonQueryRenderer } from "app/Components/ArtistFollowButton"
import { PartnerFollowButtonQueryRenderer } from "app/Components/PartnerFollowButton"
import { CustomRendererProps, TNode, NodeWithChildren, Node } from "react-native-render-html"

interface H2NodeChild extends Node {
  attribs: { href?: string }
  name: string
  data?: string
}

// Weirdly this lib is not typed well, so we need to manually type the node
export type H2Node = TNode & {
  init?: {
    domNode: NodeWithChildren & {
      children: H2NodeChild[]
      attribs: {
        href?: string
      }
    }
  }
}

/**
 * Component used by Articles, this is responsible for rendering follow buttons when
 * receiving partner or artist link
 */
export const CustomH2Renderer = ({
  TDefaultRenderer,
  tnode,
  ...props
}: CustomRendererProps<H2Node>) => {
  const href = tnode.init?.domNode.children?.[0]?.attribs?.href
  const nodeType = tnode.init?.domNode.type
  const isLink = nodeType === "tag" && tnode.init?.domNode.children?.[0]?.name === "a"
  const [, __, ___, entity, id] = href ? href.split("/") : []

  const hasManyChildren = tnode.init?.domNode.children && tnode.init.domNode.children.length > 1
  const isBighH2 =
    hasManyChildren &&
    tnode.init?.domNode.children.some(
      (child: H2NodeChild) => child.type === "text" && child.data?.includes(",")
    )

  if (!entity || !id || !isLink || isBighH2) {
    return <TDefaultRenderer tnode={tnode} {...props} />
  }

  return (
    <Flex flexDirection="row" alignItems="center" flexWrap="wrap" gap={0.5}>
      <TDefaultRenderer tnode={tnode} {...props} />

      {entity === "artist" && <ArtistFollowButtonQueryRenderer artistID={id} />}

      {entity === "partner" && <PartnerFollowButtonQueryRenderer partnerID={id} />}
    </Flex>
  )
}
