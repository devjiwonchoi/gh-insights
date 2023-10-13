# Contributions API Response JSON Schema

## Base - `contributions`

By default, returns repos created by organizations.

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1](https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1)

```json
{
  "contributions": [
    {
      "repo": "lila",
      "avatarUrl": "https://avatars.githubusercontent.com/u/16491637?v=4"
    },
    {
      "repo": "terraform",
      "avatarUrl": "https://avatars.githubusercontent.com/u/761456?v=4"
    },
    {
      "repo": "chessground",
      "avatarUrl": "https://avatars.githubusercontent.com/u/16491637?v=4"
    }
  ]
}
```

## Limit by repo's stars - `contributions.repoStars`

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.repoStars=1000](https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.repoStars=1000)

## Exclude certain repos (with owner or repo name) - `contributions.exclude`

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.repoExcludes=vercel,vscode](https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.repoExcludes=vercel,vscode)

## Limit by contribution types - `contributions.contributionTypes`

types: `commit`, `issue`, `pull`, `repo`, `review`

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.contributionTypes=commit,pull,review](https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.contributionTypes=commit,pull,review)

## Include user created repos - `contributions.includeUserRepo`

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.includeUserRepo=1](https://gh-insights.vercel.app/api?username=devjiwonchoi&contributions=1&contributions.includeUserRepo=1)
