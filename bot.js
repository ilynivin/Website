// Github Actions to run 
const github = require('@actions/github');

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;

    const prNumber = github.context.payload.pull_request.number;

    // Get the pull request details
    const { data: pullRequest } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber
    });

    // Check for base conflicts
    if (pullRequest.has_conlicts) {
      // Add a label to the pull request
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: prNumber,
        labels: ['base-conflict']
      });

      // Comment on the pull request
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: 'This pull request has base conflicts.'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
