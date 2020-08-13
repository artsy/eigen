import React from "react"
import styled from "styled-components"
import { color, space } from "../helpers"
import { Icon, IconProps, Path, Title } from "./Icon"

interface WeChatIconState {
  hover: boolean
}

/** WeChatIcon */
export class WeChatIcon extends React.Component<IconProps, WeChatIconState> {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
    }
  }

  handleMouseEnter = () => {
    this.setState({ hover: true })
  }

  handleMouseLeave = () => {
    this.setState({ hover: false })
  }

  render() {
    return (
      <WeChatContainer href="http://weixin.qq.com/r/2CotNbbES_s0rfJW93-K">
        <Icon
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          viewBox="0 0 18 18"
          {...this.props}
        >
          <Title>WeChat</Title>
          <Path
            d="M14.543 13.223c.889-.645 1.457-1.597 1.457-2.657 0-1.94-1.888-3.513-4.217-3.513-2.329 0-4.217 1.573-4.217 3.513 0 1.941 1.888 3.514 4.217 3.514.481 0 .946-.068 1.377-.192l.123-.019c.082 0 .155.025.224.065l.924.533.08.026a.14.14 0 0 0 .142-.14l-.023-.103-.19-.709-.015-.09a.28.28 0 0 1 .118-.228zM7.06 3.173C4.266 3.173 2 5.061 2 7.39c0 1.27.681 2.415 1.748 3.188.086.06.142.16.142.274l-.018.108-.228.85-.027.123c0 .094.076.17.169.17l.098-.032 1.107-.64a.53.53 0 0 1 .269-.078l.148.023a5.984 5.984 0 0 0 1.652.231l.278-.007a3.259 3.259 0 0 1-.17-1.033c0-2.124 2.066-3.846 4.615-3.846l.275.007c-.381-2.014-2.473-3.555-4.998-3.555zm3.317 6.832a.562.562 0 1 1 .001-1.125.562.562 0 0 1 0 1.125zm2.812 0a.562.562 0 1 1 0-1.125.562.562 0 0 1 0 1.125zm-7.816-3.29a.674.674 0 1 1 0-1.348.674.674 0 0 1 0 1.348zm3.374 0a.674.674 0 1 1 0-1.348.674.674 0 0 1 0 1.348z"
            fill={color(this.props.fill)}
            fillRule="evenodd"
          />
        </Icon>
        {this.state.hover && (
          <QRToolTip>
            <img src="http://files.artsy.net/images/wechat_qr_logo.png" />
          </QRToolTip>
        )}
      </WeChatContainer>
    )
  }
}

const QR_SIZE = 125
const QR_PADDING = space(2)
const QR_CONTAINER_SIZE = QR_SIZE + QR_PADDING * 2

const QRToolTip = styled.div`
  position: absolute;
  bottom: calc(100% + ${space(2)}px);
  width: ${QR_CONTAINER_SIZE}px;
  height: ${QR_CONTAINER_SIZE}px;
  right: ${(-1 * QR_SIZE) / 2}px;
  border: 1px solid ${color("black10")};
  padding: ${QR_PADDING}px;
  background-color: white;
  box-shadow: 0 10px 20px ${color("black10")};

  &::after {
    content: " ";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid white;
    bottom: -9px;
    right: calc(50% - 8px);
  }

  img {
    width: ${QR_SIZE}px;
    height: ${QR_SIZE}px;
  }
`

const WeChatContainer = styled.a`
  position: relative;
  cursor: pointer;
`
