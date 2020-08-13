import { isString } from "lodash"
import React, { Component } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import styled from "styled-components"
import { DisplayProps } from "styled-system"
import truncate from "trunc-html"

export interface ReadMoreProps extends DisplayProps {
  content: string | JSX.Element
  disabled?: boolean
  isExpanded?: boolean
  maxChars?: number
  onReadMoreClicked?: () => void
}

export interface ReadMoreState {
  isExpanded: boolean
}

/** ReadMore */
export class ReadMore extends Component<ReadMoreProps, ReadMoreState> {
  private html: string

  state = {
    isExpanded: true,
  }

  static defaultProps = {
    isExpanded: false,
    maxChars: Infinity,
  }

  constructor(props) {
    super(props)

    this.html = isString(props.content)
      ? props.content
      : renderToStaticMarkup(<>{props.content}</>)

    const RE = /(<([^>]+)>)/gi // Strip HTML tags to get innerText char count
    const { length } = this.html.replace(RE, "") //
    const isExpanded = props.isExpanded || length < props.maxChars

    this.state = {
      isExpanded,
    }
  }

  expandText() {
    if (this.props.disabled) {
      return
    }

    this.setState(
      {
        isExpanded: true,
      },
      () => {
        this.props.onReadMoreClicked && this.props.onReadMoreClicked()
      }
    )
  }

  getContent() {
    if (this.state.isExpanded) {
      return this.html
    } else {
      return truncate(this.html, this.props.maxChars).html
    }
  }

  render() {
    const content = this.getContent()
    const isExpanded = this.state.isExpanded || this.props.isExpanded

    return (
      <Container onClick={this.expandText.bind(this)} isExpanded={isExpanded}>
        <span
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />

        {!this.state.isExpanded && <ReadMoreLink>Read more</ReadMoreLink>}
      </Container>
    )
  }
}

const ReadMoreLink = ({ children }) => {
  return (
    <span>
      {" "}
      <ReadMoreLinkContainer>
        <ReadMoreLinkText>{children}</ReadMoreLinkText>
      </ReadMoreLinkContainer>
    </span>
  )
}

const ReadMoreLinkContainer = styled.span`
  cursor: pointer;
  text-decoration: underline;
  display: inline-block;
  white-space: nowrap;
`

// NOTE: Couldn't use @artsy/palette / Sans due to root element being a `div`;
// as html content from CMS comes through as a p tag, markup is rendered invalid.
const ReadMoreLinkText = styled.span`
  display: inline;
  font-family: Unica77LLWebMedium, "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`

const Container = styled.div<ReadMoreState>`
  cursor: ${p => (p.isExpanded ? "auto" : "pointer")};

  > span > * {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-bottom: 1em;
  }

  > span > *:last-child {
    display: inline;
  }
`

Container.displayName = "Container"
