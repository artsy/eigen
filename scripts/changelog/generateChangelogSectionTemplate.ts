import * as fs from "fs"
import { changelogTemplateSections } from "@artsy/changelog"
import prettier from "prettier"

export const generateChangelogSectionTemplate = () => {
  return `### Changelog updates

<!-- 📝 Please fill out at least one of these sections. -->
<!-- ⓘ 'User-facing' changes will be published as release notes. -->
<!-- ⌫ Feel free to remove sections that don't apply. -->
<!-- • Write a markdown list or just a single paragraph, but stick to plain text. -->
<!-- 📖 eg. \`Enable lotsByFollowedArtists - john\` or \`Fix phone input misalignment - mary\`. -->
<!-- 🤷‍♂️ Replace this entire block with the hashtag \`#nochangelog\` to avoid updating the changelog. -->
<!-- ⚠️ Prefix with \`[NEEDS EXTERNAL QA]\` if a change requires external QA -->

${Object.entries(changelogTemplateSections)
  .map(([, title]) => "#### " + title)
  .join("\n\n-\n")}
-

<!-- end_changelog_updates -->
`
}

export const updateChangelogSectionTemplate = (filePath: string) => {
  let fileContents = fs.readFileSync(filePath, "utf8").toString()

  const regex = /### Changelog updates[\S\s]+end_changelog_updates.*/g
  if (!fileContents.match(regex)) {
    console.error("Can't find 'Changelog updates' section in pull request template", filePath)
    process.exit(1)
  }

  fileContents = fileContents.replace(regex, generateChangelogSectionTemplate())
  prettier
    .format(fileContents, { parser: "markdown" })
    .then((formatted) => (fileContents = formatted))

  fs.writeFileSync(filePath, fileContents, "utf8")
}

if (require.main === module) {
  updateChangelogSectionTemplate("./docs/pull_request_template.md")
}
