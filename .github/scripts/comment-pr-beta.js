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

  // Find PR associated with this commit (if triggered from a PR)
  const pullRequest = context.payload.pull_request

  console.log("pullRequest:", { pullRequest })

  if (pullRequest) {
    const platformLabel = platform === "ios" ? "iOS" : "Android"
    const comment = `🎉${platformEmoji} ${platformLabel} beta version generated: **${version}**\n\nThis beta is now available on ${deploymentTargetName}!`

    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      body: comment,
    })

    console.log(`Posted comment on PR #${pullRequest.number}`)
  } else {
    console.log("Beta was not triggered from a PR - no comment posted")
  }
}
