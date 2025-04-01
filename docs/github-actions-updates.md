# GitHub Actions Workflow Updates

The following changes are required to update the GitHub Actions workflows to use the 'master' branch instead of 'main'.

## deploy.yml

1. Update branch references in the trigger section:
```yaml
on:
  push:
    branches: [master]  # Change from [main]
    paths:
      - 'public/data/videos.json'
      - 'public/data/events.json'
  pull_request:
    branches: [master]  # Change from [main]
  workflow_dispatch:
```

2. Update git push command in the build job:
```yaml
- name: Commit updated data files
  run: |
    git config --global user.name "github-actions"
    git config --global user.email "github-actions@github.com"
    git add public/data/videos.json public/data/events.json
    git commit -m "Update API data" || echo "No changes to commit"
    git push origin master || echo "No changes to push"  # Change from main
```

3. Update deployment branch condition:
```yaml
if: github.ref == 'refs/heads/master'  # Change from 'refs/heads/main'
```

## update_meetup_events.yml

1. Update git push command:
```yaml
- name: Get Meetup events and generate data
  run: |
    python scripts/meetup_events.py
    git add public/data/events.json
    git commit -m "Update Meetup events data" || echo "No changes to commit"
    git push origin master || echo "No changes to push"  # Change from main
```

2. Update workflow dispatch reference:
```yaml
- name: Trigger deploy workflow
  if: success() && steps.check_changes.outputs.changes_pushed == 'true'
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      await github.rest.actions.createWorkflowDispatch({
        owner: context.repo.owner,
        repo: context.repo.repo,
        workflow_id: 'deploy.yml',
        ref: 'master'  # Change from 'main'
      });
```

## update_yt_videos.yml

1. Update git push command:
```yaml
- name: Get YouTube videos and generate data
  env:
    YOUTUBE_DATA_API_KEY: ${{ secrets.YOUTUBE_DATA_API_KEY }}
    YOUTUBE_CHANNEL_ID: ${{ secrets.RVNUG_YT_CHANNEL_ID }}
  run: |
    python scripts/youtube_latest_videos.py
    git add public/data/videos.json
    git commit -m "Update video data" || echo "No changes to commit"
    git push origin master || echo "No changes to push"  # Change from main
```

2. Update workflow dispatch reference:
```yaml
- name: Trigger deploy workflow
  if: success() && steps.check_changes.outputs.changes_pushed == 'true'
  uses: actions/github-script@v7
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      await github.rest.actions.createWorkflowDispatch({
        owner: context.repo.owner,
        repo: context.repo.repo,
        workflow_id: 'deploy.yml',
        ref: 'master'  # Change from 'main'
      });
``` 