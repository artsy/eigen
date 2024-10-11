import { changelogTemplateSections } from "./changelogTemplateSections"

export const parsePRDescription = (description: string): ParseResult => {
  description = stripComments(description)
  if (description.includes("#nochangelog")) {
    return { type: "no_changes" }
  }

  const lines = description.split("\n").map((line) => line.trim())

  const result: ParseResult = {
    androidUserFacingChanges: [],
    crossPlatformUserFacingChanges: [],
    devChanges: [],
    iOSUserFacingChanges: [],
    type: "changes",
  }

  for (const [sectionKey, sectionTitle] of Object.entries(changelogTemplateSections)) {
    let i = lines.indexOf("#### " + sectionTitle)
    if (i === -1) {
      continue
    }
    i++
    // either a single text paragraph or a list.
    const sectionLines = []
    while (i < lines.length && lines[i].match(/^( *\w|-[\w ]|\*[\w ]|\s*$)/)) {
      sectionLines.push(lines[i])
      i++
    }
    // @ts-expect-error
    result[sectionKey] = groupItems(sectionLines)
  }

  if (
    result.androidUserFacingChanges.length === 0 &&
    result.crossPlatformUserFacingChanges.length === 0 &&
    result.devChanges.length === 0 &&
    result.iOSUserFacingChanges.length === 0
  ) {
    return { type: "error" }
  }

  return result
}

function stripComments(text: string) {
  return text.replace(/<!--.*?-->/g, "")
}

function groupItems(lines: string[]) {
  const result: string[] = []

  let group: string[] = []

  for (const line of lines) {
    if (line.startsWith("-") || line.startsWith("*")) {
      if (group.length) {
        result.push(group.join("\n"))
      }
      group = [line.slice(1).trim()]
    } else if (line.match(/^\s*$/)) {
      // paragraph
      if (group.length) {
        result.push(group.join("\n"))
      }
      group = []
    } else {
      group.push(line.trim())
    }
  }
  if (group.length) {
    result.push(group.join("\n"))
  }

  return result
}

export type ParseResult =
  | { type: "error" } // for when no changelog-related stuff is found
  | { type: "no_changes" } // for when we add #nochangelog hashtag
  | ({ type: "changes" } & ParseResultChanges)

interface ParseResultChanges {
  crossPlatformUserFacingChanges: string[]
  iOSUserFacingChanges: string[]
  androidUserFacingChanges: string[]
  devChanges: string[]
}
