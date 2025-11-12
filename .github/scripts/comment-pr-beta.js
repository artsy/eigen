// Script to comment on PR with beta version information
// Usage: Called via actions/github-script@v7 with env variables:
//   BETA_VERSION - The beta version number
//   PLATFORM - Either 'ios' or 'android'
//   DEPLOYMENT_TARGET - Either 'testflight', 'firebase', or 'play_store'

module.exports = async ({ github, context, core }) => {
  const version = process.env.BETA_VERSION;
  const platform = process.env.PLATFORM;
  const deploymentTarget = process.env.DEPLOYMENT_TARGET;

  if (!version) {
    core.warning('No beta version provided');
    return;
  }

  if (!platform || !deploymentTarget) {
    core.setFailed('PLATFORM and DEPLOYMENT_TARGET environment variables are required');
    return;
  }

  // Determine platform emoji
  const platformEmoji = platform === 'ios' ? '🍏' : '🤖';

  // Determine deployment target name
  const deploymentTargetName = {
    'testflight': 'TestFlight',
    'firebase': 'Firebase',
    'play_store': 'Play Store'
  }[deploymentTarget];

  if (!deploymentTargetName) {
    core.setFailed(`Invalid DEPLOYMENT_TARGET: ${deploymentTarget}`);
    return;
  }

  // Find PR associated with this commit
  const { data: pullRequests } = await github.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    head: context.ref.replace('refs/heads/', '')
  });

  if (pullRequests.length > 0) {
    const pr = pullRequests[0];

    const platformLabel = platform === 'ios' ? 'iOS' : 'Android';
    const comment = `🎉${platformEmoji} ${platformLabel} beta version generated: **${version}**\n\nThis beta is now available on ${deploymentTargetName}!`;

    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body: comment
    });

    console.log(`Posted comment on PR #${pr.number}`);
  } else {
    console.log('No open PR found for this branch');
  }
};
