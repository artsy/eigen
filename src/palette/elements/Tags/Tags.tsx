import React, { useEffect, useRef, useState } from "react"
import { color } from "../../helpers"
import { styledWrapper } from "../../platform/primitives"
import { Box } from "../Box"
import { Flex } from "../Flex"
import { Join } from "../Join"
import { Link } from "../Link"
import { Sans } from "../Typography"

interface TagProps {
  name: string
  href: string
}

interface TagsProps {
  tags: TagProps[]
  displayNum?: number
}
/**
 * Use tags for genes and categories that relate to an Artist or Artwork.
 */
export const Tags: React.FC<TagsProps> = ({
  tags,
  displayNum = tags.length,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [boxHeight, setBoxHeight] = useState("auto")
  const flexContainer = useRef<HTMLDivElement>(null)
  const animatingBox = useRef<HTMLDivElement>(null)
  // after animating AnimatingBox height set back height to auto (to handle screen resize etc.)
  useEffect(() => {
    animatingBox.current.addEventListener("transitionend", e => {
      const isAnimatingBoxTransition = e.target === animatingBox.current
      if (isAnimatingBoxTransition) {
        setBoxHeight("auto")
      }
    })
  }, [])
  const sliceSize = expanded ? tags.length : displayNum
  const tagEls = tags.slice(0, sliceSize).map((tag, i) => {
    return <Tag key={i} {...tag} />
  })

  /**
   * By default AnimationBox height is auto. for open/close transition:
   * 1. explicitly set the height to be the same as the flex container inside it,
   * 2. display new tags (setExpanded(true))
   * 3. set the height to the new flexContainer height so the animation triggers
   */
  const toggleMore = () => {
    const BORDER_OFFSET = 2
    const oldHeight = flexContainer.current.offsetHeight - BORDER_OFFSET
    setBoxHeight(oldHeight + "px")

    setExpanded(!expanded)

    // wait for a tick
    setTimeout(() => {
      const newHeight = flexContainer.current.offsetHeight - BORDER_OFFSET
      setBoxHeight(`${newHeight}px`)
    }, 10)
  }

  const moreButton = displayNum < tags.length && !expanded && (
    <MoreTag count={tags.length - displayNum} onClick={toggleMore} />
  )

  return (
    <AnimatingBox height={boxHeight} ref={animatingBox as any}>
      <Flex flexWrap="wrap" mb={-0.5} ref={flexContainer as any}>
        <Join separator={<Box pl={0.5} />}>
          {tagEls}
          {moreButton}
        </Join>
      </Flex>
    </AnimatingBox>
  )
}

const AnimatingBox = styledWrapper(Box)`
  transition: height 0.25s ease;
  overflow: hidden;
`

const Tag: React.FC<TagProps> = ({ name, href }) => {
  return (
    <Link href={href} underlineBehavior="none">
      <TagBox>{name}</TagBox>
    </Link>
  )
}

const tagsBoxMargins = {
  px: 1,
  py: 0.5,
  mb: 0.5,
}

const TagBox: React.FC = ({ children }) => (
  <HoverBox {...tagsBoxMargins}>
    <Sans size="2" color="black60">
      {children}
    </Sans>
  </HoverBox>
)

const MoreTag: React.FC<{ onClick: (e) => void; count: number }> = ({
  onClick,
  count,
}) => {
  return (
    <MoreBox {...tagsBoxMargins} onClick={onClick}>
      <Sans size="2" color="black60">
        +{count} more
      </Sans>
    </MoreBox>
  )
}

const HoverBox = styledWrapper(Box)`
  border: 1px solid ${color("black5")};
  border-radius: 2px;
  background-color: ${color("black5")};
  &:hover {
    background-color: ${color("black10")};
    border-color: ${color("black10")};
  }
  transition: all 0.25s;
`

const MoreBox = styledWrapper(Box)`
  border: 1px solid ${color("black5")};
  border-radius: 2px;
  &:hover {
    border-color: ${color("black10")};
  }
  transition: all 0.25s;
  cursor: pointer;
`
