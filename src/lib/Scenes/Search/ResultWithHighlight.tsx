import GraphemeSplitter from "grapheme-splitter"
import { normalizeText } from "lib/utils/normalizeText"
import { Text } from "palette"
import React from "react"
import styled from "styled-components/native"

const splitter = new GraphemeSplitter()

export const SmallText = styled(Text).attrs({ variant: "xs" })``

export const ItalicText: React.FC<{ color?: string }> = ({ color = "black60", children }) => {
  return (
    <SmallText italic color={color}>
      {children}
    </SmallText>
  )
}

const Result: React.FC<{ result: string[] }> = ({ result }) => {
  const [nonMatch, match, nonMatch2] = result

  return (
    <SmallText>
      {nonMatch}
      <SmallText weight="medium" color="blue100" style={{ padding: 0, margin: 0 }}>
        {match}
      </SmallText>
      {nonMatch2}
    </SmallText>
  )
}

export const ResultWithItalic: React.FC<{ result: string[] }> = ({ result }) => {
  const [nonMatch, match, nonMatch2] = result

  // If the result string is e.g. "Henri Venne, The Sun Shines Cold (2015)",
  // the part after the comma should be italic grey
  // So let's assume the query is "Cold"
  // the result array will be ["Henri Venne, The Sun Shines ", "Cold", " (2015)"]
  if (nonMatch.includes(",")) {
    const [mainNonMatch, ...rest] = nonMatch.split(",")
    const restNonMatch = rest.join(",")
    return (
      <>
        <SmallText>{mainNonMatch}</SmallText>

        <ItalicText>
          {restNonMatch}
          <ItalicText color="blue100">{match}</ItalicText>
          {nonMatch2}
        </ItalicText>
      </>
    )
  }

  // If the result string is e.g. "Christ on the Cold Stone, Brabant (1990)",
  // the part after the comma should be italic grey
  // So let's assume the query is "Cold"
  // the result array will be ["Christ on the ", "Cold", " Stone, Brabant (1990)"]
  if (nonMatch2.includes(",")) {
    const [mainNonMatch2, ...rest] = nonMatch2.split(",")
    const restNonMatch2 = rest.join(",")
    return (
      <>
        <SmallText>
          {nonMatch}
          <SmallText weight="medium" color="blue100">
            {match}
          </SmallText>
          {mainNonMatch2}
        </SmallText>

        <ItalicText>{restNonMatch2}</ItalicText>
      </>
    )
  }

  return <Result result={result} />
}

export const ResultWithHighlight = ({
  displayLabel,
  highlight,
  categoryName,
}: {
  displayLabel: string
  highlight?: string
  categoryName: string
}) => {
  // If highlight is not supplied then use medium weight, since the search result
  // is being rendered in a context that doesn't support highlights
  if (highlight === undefined) {
    return <SmallText weight="medium">{displayLabel}</SmallText>
  }
  if (!highlight.trim()) {
    return <SmallText weight="regular">{displayLabel}</SmallText>
  }
  // search for `highlight` in `displayLabel` but ignore diacritics in `displayLabel`
  // so that a user can type, e.g. `Miro` and see `Miró` highlighted
  const labelGraphemes = splitter.splitGraphemes(displayLabel)
  const highlightGraphemes = splitter.splitGraphemes(highlight)
  let result: [string, string, string] | null = null
  outerLoop: for (let i = 0; i < labelGraphemes.length; i++) {
    innerLoop: for (let j = 0; j < highlightGraphemes.length; j++) {
      if (i + j >= labelGraphemes.length) {
        continue outerLoop
      }
      const labelGrapheme = normalizeText(labelGraphemes[i + j])
      const highlightGrapheme = normalizeText(highlightGraphemes[j])
      if (labelGrapheme === highlightGrapheme) {
        // might be a match, continue to see for sure
        continue innerLoop
      } else {
        // not a match so go on to the next grapheme in the label
        continue outerLoop
      }
    }
    // innerloop eneded naturally so there was a match
    result = [
      labelGraphemes.slice(0, i).join(""),
      labelGraphemes.slice(i, i + highlightGraphemes.length).join(""),
      labelGraphemes.slice(i + highlightGraphemes.length).join(""),
    ]
    break outerLoop
  }

  if (!result) {
    return <SmallText weight="regular">{displayLabel}</SmallText>
  }

  if (categoryName === "Artwork") {
    return <ResultWithItalic result={result} />
  }

  return <Result result={result} />
}
