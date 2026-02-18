// Script to comment on PR with beta version information
// Usage: Called via actions/github-script@v7 with env variables:
//   BETA_VERSION - The beta version number
//   PLATFORM - Either 'ios' or 'android'
//   DEPLOYMENT_TARGET - Either 'testflight', 'firebase', or 'play_store'

module.exports = async ({ github, context, core }) => {
  const version = process.env.BETA_VERSION
  const platform = process.env.PLATFORM
  const deploymentTarget = process.env.DEPLOYMENT_TARGET

  if (!version) {
    core.warning("No beta version provided")
    return
  }

  if (!platform || !deploymentTarget) {
    core.setFailed("PLATFORM and DEPLOYMENT_TARGET environment variables are required")
    return
  }

  // Determine platform emoji
  const platformEmoji = platform === "ios" ? "🍏" : "🤖"

  // Determine deployment target name
  const deploymentTargetName = {
    testflight: "TestFlight",
    firebase: "Firebase",
    play_store: "Play Store",
  }[deploymentTarget]

  if (!deploymentTargetName) {
    core.setFailed(`Invalid DEPLOYMENT_TARGET: ${deploymentTarget}`)
    return
  }

  // Find PR associated with this commit
  try {
    const { data: pullRequests } = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: "open",
      per_page: 100,
    })

    // Find the PR that contains this commit
    const associatedPR = pullRequests.find((pr) => {
      return pr.head.sha === context.sha
    })

    if (associatedPR) {
      const platformLabel = platform === "ios" ? "iOS" : "Android"
      const commitHash = context.sha.substring(0, 7) // Short hash
      const newBetaEntry = `- **${version}** - Available on ${deploymentTargetName}`

      // Comment marker to identify our beta versions comment for this specific commit
      const commentMarker = `<!-- beta-versions-comment-${commitHash} -->`

      // Get all comments on the PR
      const { data: comments } = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: associatedPR.number,
      })

      // Find existing beta versions comment
      const existingComment = comments.find((comment) => comment.body.includes(commentMarker))

      if (existingComment) {
        // Parse existing comment and add new beta
        let commentBody = existingComment.body

        // Check if this platform section already exists
        const platformSectionRegex = new RegExp(
          `### ${platformLabel} ${platformEmoji}([\\s\\S]*?)(?=###|$)`
        )
        const platformSectionMatch = commentBody.match(platformSectionRegex)

        if (platformSectionMatch) {
          // Platform section exists, append to it
          const existingSection = platformSectionMatch[0]
          const updatedSection = existingSection.trimEnd() + "\n" + newBetaEntry
          commentBody = commentBody.replace(existingSection, updatedSection)
        } else {
          // Platform section doesn't exist, add it
          commentBody += `\n\n### ${platformLabel} ${platformEmoji}\n${newBetaEntry}`
        }

        // Update the existing comment
        await github.rest.issues.updateComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          comment_id: existingComment.id,
          body: commentBody,
        })

        console.log(`Updated existing comment on PR #${associatedPR.number}`)
      } else {
        // Create new comment with structured format
        const comment = `${commentMarker}
## 🎉 Beta Versions Generated (commit: \`${commitHash}\`)

### ${platformLabel} ${platformEmoji}
${newBetaEntry}`

        await github.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: associatedPR.number,
          body: comment,
        })

        console.log(`Created new comment on PR #${associatedPR.number}`)
      }
    } else {
      console.log("Beta was not triggered from an open PR - no comment posted")
    }
  } catch (error) {
    core.warning(`Failed to find or comment on PR: ${error.message}`)
  }
}
