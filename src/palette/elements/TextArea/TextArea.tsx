import { themeGet } from "@styled-system/theme-get"
import React, { ChangeEvent } from "react"
import styled, { css } from "styled-components"
import { color } from "../../helpers/color"
import { space } from "../../helpers/space"
import { Collapse } from "../Collapse"
import { Flex } from "../Flex"
import { Spacer } from "../Spacer"
import { Sans } from "../Typography/Typography"

const StyledTextArea = styled.textarea`
  transition: border-color 0.25s ease;
  padding: ${space(1)}px;
  min-height: ${space(9)}px;
  font-family: ${themeGet("fontFamily.sans.regular")};
  font-size: ${themeGet("typeSizes.sans.3.fontSize")};
  line-height: ${themeGet("typeSizes.sans.3.lineHeight")};
  outline: none;
  ${({ hasError }: { hasError?: boolean }) => css`
    border: 1px solid ${color(hasError ? "red100" : "black10")};
    :active,
    :focus {
      border-color: ${color(hasError ? "red100" : "purple100")};
    }
  `};
  resize: vertical;
`

const Required = styled.span`
  color: ${color("purple100")};
`

export interface TextAreaProps {
  error?: string
  required?: boolean
  characterLimit?: number
  title?: React.ReactNode
  description?: React.ReactNode
  onChange?(result: TextAreaChange): void

  // forwarded to the styled.input
  className?: string
  defaultValue?: string
  innerRef?: React.RefObject<HTMLTextAreaElement>
  name?: string
  placeholder?: string
}

interface TextAreaState {
  value: string
}

export interface TextAreaChange {
  value: string
  exceedsCharacterLimit: boolean
}

/** TextArea */
export class TextArea extends React.Component<TextAreaProps, TextAreaState> {
  state: TextAreaState = {
    value: this.props.defaultValue || "",
  }

  componentDidMount() {
    const { defaultValue } = this.props
    if (defaultValue) {
      this.handleTextChange(defaultValue)
    }
  }

  handleTextChange(nextValue: string) {
    this.setState({ value: nextValue }, () => {
      const { onChange } = this.props
      const { value } = this.state
      onChange &&
        onChange({
          value,
          exceedsCharacterLimit: this.characterLimitExceeded(),
        })
    })
  }

  characterLimitExceeded() {
    const { characterLimit } = this.props
    const { value } = this.state
    return Boolean(characterLimit && value.length > characterLimit)
  }

  onChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    this.handleTextChange(ev.currentTarget.value)
  }

  render() {
    const { error, characterLimit, title, description, ...others } = this.props
    const { value } = this.state

    const hasError = Boolean(error || this.characterLimitExceeded())

    return (
      <Flex flexDirection="column">
        {title && (
          <>
            <Sans size="3t">
              {title}
              {this.props.required && <Required>*</Required>}
            </Sans>
          </>
        )}
        {description && (
          <>
            <Sans size="2" color="black60">
              {description}
            </Sans>
          </>
        )}
        {(title || description) && <Spacer mb={1} />}
        <StyledTextArea
          {...others}
          onChange={this.onChange}
          hasError={hasError}
        />
        <Spacer mb={1} />
        <Flex justifyContent="space-between">
          <Collapse open={Boolean(error)}>
            <Sans color="red100" size="2">
              {error}
            </Sans>
          </Collapse>
          <Flex />
          {typeof characterLimit !== "undefined" && (
            <Sans
              size="2"
              color={this.characterLimitExceeded() ? "red100" : "black60"}
            >
              {value.length} / {characterLimit} max
            </Sans>
          )}
        </Flex>
      </Flex>
    )
  }
}
