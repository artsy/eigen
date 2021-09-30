import GraphemeSplitter from "grapheme-splitter"
import { normalizeText, punctuationRegex } from "lib/utils/normalizeText"
import { Text } from "palette"
import React from "react"
import styled from "styled-components/native"

const splitter = new GraphemeSplitter()

const isSpecialChar = (value: string) => {
  return punctuationRegex.test(value)
}

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

export const ResultWithHighlight = ({
  displayLabel,
  artistName,
  date,
  highlight,
  categoryName,
}: {
  displayLabel: string
  artistName?: string | null
  date?: string | null
  highlight?: string
  categoryName: string
}) => {
  const isArtwork = categoryName === "Artwork"
  const displayLabelToCompare = isArtwork ? `${artistName} ${displayLabel} ${date}` : displayLabel

  // If highlight is not supplied then use medium weight, since the search result
  // is being rendered in a context that doesn't support highlights
  if (highlight === undefined) {
    return <SmallText weight="medium">{displayLabelToCompare}</SmallText>
  }
  if (!highlight.trim()) {
    return <SmallText weight="regular">{displayLabelToCompare}</SmallText>
  }
  // search for `highlight` in `displayLabel` but ignore diacritics in `displayLabel`
  // so that a user can type, e.g. `Miro` and see `Miró` highlighted
  const labelGraphemes = splitter.splitGraphemes(displayLabelToCompare)
  const highlightGraphemes = splitter.splitGraphemes(highlight)

  let result: [string, string, string] | null = null
  let innerLoopInitIndex = 0
  // stores count of chars within highlight in order to align where the highlight starts
  let charsCount = 0

  outerLoop: for (let i = 0; i < labelGraphemes.length; i++) {
    innerLoop: for (let j = innerLoopInitIndex; j < highlightGraphemes.length; j++) {
      if (i + j >= labelGraphemes.length) {
        continue outerLoop
      }

      const labelGrapheme = normalizeText(labelGraphemes[i + j], true)
      const highlightGrapheme = normalizeText(highlightGraphemes[j], true)

      if (labelGrapheme === highlightGrapheme) {
        // might be a match, continue to see for sure
        continue innerLoop
      } else if (isSpecialChar(labelGrapheme)) {
        // labelGrapheme is some character so go on to the next labelGrapheme not resetting highlightGrapheme
        innerLoopInitIndex = j
        charsCount = j === 0 ? 0 : charsCount + 1
        continue outerLoop
      } else {
        innerLoopInitIndex = 0
        charsCount = 0
        // not a match so go on to the next grapheme in the label
        continue outerLoop
      }
    }
    // innerloop eneded naturally so there was a match

    const firstHighlightIndex = i - charsCount

    result = [
      labelGraphemes.slice(0, firstHighlightIndex).join(""),
      labelGraphemes.slice(firstHighlightIndex, i + highlightGraphemes.length).join(""),
      labelGraphemes.slice(i + highlightGraphemes.length).join(""),
    ]
    break outerLoop
  }

  if (!result) {
    return <SmallText weight="regular">{displayLabelToCompare}</SmallText>
  }

  return <Result result={result} />
}
