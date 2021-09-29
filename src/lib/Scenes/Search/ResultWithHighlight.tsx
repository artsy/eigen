import GraphemeSplitter from "grapheme-splitter"
import { normalizeText } from "lib/utils/normalizeText"
import { Text } from "palette"
import React from "react"
import styled from "styled-components/native"

const splitter = new GraphemeSplitter()

export const SmallText = styled(Text).attrs({ variant: "xs" })``

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

export const ResultWithHighlight = ({ displayLabel, highlight }: { displayLabel: string; highlight?: string }) => {
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

  return <Result result={result} />
}
