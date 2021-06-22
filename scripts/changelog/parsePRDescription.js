// @ts-check

const { changelogTemplateSections } = require("./generateChangelogSectionTemplate")

/**
 * @param {string} description
 * @returns {import('./changelog-types').ParseResult}
 */
module.exports.parsePRDescription = (description) => {
  description = stripComments(description)
  if (description.includes("#nochangelog")) {
    return { type: "no_changes" }
  }

  const lines = description.split("\n").map(line => line.trim())

  /**
   * @type {import('./changelog-types').ParseResult}
   */
  const result = {
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
    // either a single text paragraph or a list
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

/**
 * @param {string} text
 */
function stripComments(text) {
  return text.replace(/<!--.*?-->/g, "")
}

/**
 * @param {string[]} lines
 */
function groupItems(lines) {
  /**
   * @type {string[]}
   */
  const result = []

  /**
   * @type {string[]}
   */
  let group = []

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
