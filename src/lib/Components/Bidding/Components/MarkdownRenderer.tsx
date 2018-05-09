import React from "react"
import { Text } from "react-native"
import styled from "styled-components/native"

import { Serif16 } from "../Elements/Typography"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

interface NativeMarkdownProps {
  children: string
}

const PARAGRAPH_BREAK = "   "

export class MarkdownRenderer extends React.Component<NativeMarkdownProps> {
  render() {
    const message = this.props.children
    if (!message) {
      return
    }

    const paragraphs = message.split(PARAGRAPH_BREAK)
    const paragraphEls = paragraphs.map((p, i) => {
      let paragraph = p
      const re = new RegExp(/\[([\w\s]*)\]\(([\w\:\/\.]*)\)/g)
      let linkData = re.exec(paragraph)
      const content = []
      let j = 0
      while (linkData && linkData.length) {
        // closure to keep a local copy of href
        ;(() => {
          const text = linkData[1]
          const href = linkData[2]
          // linkData.index is the index of first match e.g. link
          const textBefore = paragraph.slice(0, linkData.index)
          content.push(
            <Text key={j}>
              {textBefore}
              <LinkText
                onPress={() => {
                  SwitchBoard.presentModalViewController(this, href)
                }}
              >
                {text}
              </LinkText>
            </Text>
          )
        })()
        // remove the processed link and reset regex state
        paragraph = paragraph.slice(linkData.index + linkData[0].length)
        re.lastIndex = 0
        linkData = re.exec(paragraph)
        j++
      }
      // add text after link
      content.push(<Text key={"rest"}>{paragraph}</Text>)

      return <Paragraph key={i}>{content}</Paragraph>
    })
    return paragraphEls
  }
}

const LinkText = styled.Text`
  text-decoration-line: underline;
`

const Paragraph = props => <Serif16 mb={5} textAlign="center" color="black60" maxWidth={280} {...props} />
