# GitHub Branch Protection Setup

To ensure that pull requests can only be merged when the build verification passes, follow these steps to set up branch protection rules in GitHub:

## Steps to Configure Branch Protection

1. **Go to the Repository Settings**
   - Navigate to your GitHub repository
   - Click on "Settings" in the top navigation bar
   - Select "Branches" from the left sidebar

2. **Add Branch Protection Rule**
   - Click on "Add rule" button
   - In the "Branch name pattern" field, enter `main`

3. **Configure Protection Settings**
   - Check "Require a pull request before merging"
   - Check "Require status checks to pass before merging"
   - In the status checks search box, search for and select:
     - `build-verification` (from the pr-checks workflow)
     - `typescript-check` (from the pr-checks workflow)
   - These status checks will appear after the first PR is created that triggers the workflow

4. **Additional Recommended Settings**
   - Check "Require branches to be up to date before merging"
   - Check "Do not allow bypassing the above settings"
   - Optionally, check "Restrict who can push to matching branches" if you want to limit who can push directly to main

5. **Save Changes**
   - Click "Create" or "Save changes" at the bottom of the page

## Verification

Once this is set up:
1. Any new pull request will automatically trigger the checks
2. The PR cannot be merged until all required status checks pass
3. If code changes fail the build verification, the PR will be blocked until the issues are fixed

## Troubleshooting

If status checks don't appear in the dropdown:
1. Make sure you've pushed the new workflow files to the repository
2. Create a test PR to trigger the workflows
3. After the workflows run at least once, the status checks will appear in the dropdown

## Best Practices

- Never directly commit to the main branch
- Always create feature branches and pull requests
- Address any build failures promptly
- Consider setting up automatic PR assignment and reviewers 