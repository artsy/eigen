import React from "react"
import styled from "styled-components"
import { CloseIcon } from "../../svgs"
import { Box } from "../Box"
import { Flex } from "../Flex"
import { Sans } from "../Typography"

const Target = styled(Flex)`
  padding-left: 10px;
  cursor: pointer;

  svg {
    display: block;
  }
`

const Wrapper = styled(Box)`
  transition: background-color 250ms linear;
  display: flex;
`

const TextWrapper = styled(Flex)`
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
`

const CloseButton = ({ onClick }) => {
  return (
    <Target onClick={onClick} alignItems="center">
      <CloseIcon fill="white100" />
    </Target>
  )
}

export interface BannerProps {
  dismissable: boolean
  message?: string
  backgroundColor: string
  textColor: string
}

/**
 * A banner
 */
export class Banner extends React.Component<BannerProps> {
  static defaultProps = {
    dismissable: false,
    backgroundColor: "red100",
    textColor: "white100",
  }

  state = {
    dismissed: false,
  }

  handleCloseClick = () => {
    this.setState({ dismissed: true })
  }

  render() {
    if (this.state.dismissed) return null
    const showCloseButton = this.props.dismissable

    return (
      <Wrapper
        bg={this.props.backgroundColor}
        color={this.props.textColor}
        p={1}
      >
        <TextWrapper>
          <Sans size="2">{this.props.children || this.props.message}</Sans>
        </TextWrapper>
        {showCloseButton && <CloseButton onClick={this.handleCloseClick} />}
      </Wrapper>
    )
  }
}
