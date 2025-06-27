import { ArtistFollowButtonQueryRenderer } from "app/Components/ArtistFollowButton"
import { useMemo } from "react"
import { View } from "react-native"
import { TDefaultRendererProps } from "react-native-render-html"

const extractIdFromHref = (href: string): string => {
  return href.split("/").pop() ?? ""
}

export const CustomH2Renderer = ({ TDefaultRenderer, tnode, ...props }: TDefaultRendererProps) => {
  const textContent = tnode.domNode?.textContent ?? ""

  const artistLinks = useMemo(() => {
    return tnode.children.filter(
      (child) => child.tagName === "a" && child.domNode?.attribs?.href?.startsWith("/artist/")
    )
  }, [tnode])

  const hasComma = textContent.includes(",")

  const shouldRenderFollowCTA = artistLinks.length === 1 && !hasComma

  const artistHref = artistLinks[0]?.domNode?.attribs?.href
  const artistID = artistHref ? extractIdFromHref(artistHref) : null

  return (
    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
      <TDefaultRenderer tnode={tnode} {...props} />
      {!!shouldRenderFollowCTA && !!artistID && (
        <View style={{ marginLeft: 8 }}>
          <ArtistFollowButtonQueryRenderer artistID={artistID} />
        </View>
      )}
    </View>
  )
}
