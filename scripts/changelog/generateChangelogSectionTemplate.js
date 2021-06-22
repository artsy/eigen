// @ts-check

const changelogTemplateSections = {
  androidUserFacingChanges: "Android user-facing changes",
  crossPlatformUserFacingChanges: "Cross-platform user-facing changes",
  devChanges: "Dev changes",
  iOSUserFacingChanges: "iOS user-facing changes",
}

module.exports.changelogTemplateSections = changelogTemplateSections

module.exports.generateChangelogSectionTemplate = () => {
  return `### Changelog updates

<!-- 📝 Please fill out at least one of these sections. -->
<!-- ⓘ 'User-facing' changes will be published as release notes. -->
<!-- ⌫ Feel free to remove sections that don't apply. -->
<!-- • Write a markdown list or just a single paragraph, but stick to plain text. -->
<!-- 🤷‍♂️ Replace this entire block with the hashtag \`#nochangelog\` to avoid updating the changelog. -->
${Object.entries(changelogTemplateSections)
  .map(([, title]) => "#### " + title)
  .join("\n-\n")}
-

<!-- end_changelog_updates -->
`
}

const fs = require("fs")
const prettier = require("prettier")

/**
 * @param {string} filePath
 */
module.exports.updateChangelogSectionTemplate = (filePath) => {
  let fileContents = fs.readFileSync(filePath, "utf8").toString()

  const regex = /### Changelog updates[\S\s]+end_changelog_updates.*/g
  if (!fileContents.match(regex)) {
    // tslint:disable-next-line
    console.error("Can't find 'Changelog updates' section in pull request template", filePath)
    process.exit(1)
  }

  fileContents = fileContents.replace(regex, this.generateChangelogSectionTemplate())
  fileContents = prettier.format(fileContents, { parser: "markdown" })

  fs.writeFileSync(filePath, fileContents, "utf8")
}

// @ts-ignore
if (require.main === module) {
  this.updateChangelogSectionTemplate("./docs/pull_request_template.md")
}
