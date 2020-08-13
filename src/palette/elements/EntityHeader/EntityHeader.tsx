import React, { SFC } from "react"
import styled from "styled-components"
import { Color } from "../../Theme"
import { Avatar } from "../Avatar"
import { Box } from "../Box"
import { Flex } from "../Flex"
import { Link } from "../Link"
import { SpacerProps } from "../Spacer"
import { Sans } from "../Typography"

interface EntityHeaderProps extends SpacerProps {
  href?: string
  imageUrl?: string
  initials?: string
  meta?: string
  name: string
  FollowButton?: JSX.Element
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  smallVariant?: boolean
}

interface ContainerComponentProps {
  color?: Color
  href?: string
  noUnderline?: boolean
}

/**
 * Component that is used as entity header that is paired with rich information about the entity.
 * Spec: zpl.io/aNoYM6d
 */
export const EntityHeader: SFC<EntityHeaderProps> = ({
  href,
  imageUrl,
  initials,
  name,
  meta,
  FollowButton,
  smallVariant,
  ...remainderProps
}) => {
  const ContainerComponent = href ? FlexLink : Flex
  // new () => React.Component < any, any >
  // StyledComponentClass < React.ClassAttributes < HTMLAnchorElement >
  const containerProps: ContainerComponentProps = href
    ? { color: "black100", noUnderline: true, href }
    : {}

  return (
    <ContainerComponent {...remainderProps} {...containerProps}>
      {(imageUrl || initials) && (
        <Flex mr={1}>
          <Avatar size="xs" src={imageUrl} initials={initials} />
        </Flex>
      )}

      {smallVariant ? (
        <Flex alignItems="center" width="100%">
          <Sans size="3">{name}</Sans>

          <Sans size="3">
            {FollowButton && (
              <>
                {
                  <Sans size="3" mx={0.3} display="inline-block">
                    •
                  </Sans>
                }
                <Box
                  display="inline-block"
                  onClick={event => {
                    // Capture click event so that interacting with Follow doesn't
                    // trigger Container's link.
                    event.stopPropagation()
                  }}
                >
                  {FollowButton}
                </Box>
              </>
            )}
          </Sans>
        </Flex>
      ) : (
        <Flex flexDirection="column" justifyContent="center" width="100%">
          <Sans size="3" weight="medium" color="black100">
            {name}
          </Sans>

          <Sans size="2" color="black60">
            {!!meta && <span>{meta}</span>}

            {FollowButton && (
              <>
                {meta && (
                  <Sans
                    size="2"
                    color="black60"
                    mx={0.3}
                    display="inline-block"
                  >
                    •
                  </Sans>
                )}
                <Box
                  display="inline-block"
                  onClick={event => {
                    // Capture click event so that interacting with Follow doesn't
                    // trigger Container's link.
                    event.stopPropagation()
                  }}
                >
                  {FollowButton}
                </Box>
              </>
            )}
          </Sans>
        </Flex>
      )}
    </ContainerComponent>
  )
}

const FlexLink = styled(Link)`
  display: flex;
`

EntityHeader.displayName = "EntityHeader"
