# Discussions API Response JSON Schema

## Base - `discussions`

By default, returns repos created by organizations.

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1](https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1)

```json
{
  "discussions": {
    "started": { "totalCount": 25 },
    "comments": { "totalCount": 410 },
    "answers": { "totalCount": 49 }
  }
}
```

## List repo names - `discussions.listRepo`

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1](https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1)

```json
{
  "discussions": {
    "started": { "totalCount": 25 },
    "comments": { "totalCount": 410 },
    "answers": { "totalCount": 49 },
    "repoList": [
      {
        "repo": "next.js",
        "avatarUrl": "https://avatars.githubusercontent.com/u/14985020?v=4"
      },
      {
        "repo": "nextra",
        "avatarUrl": "https://avatars.githubusercontent.com/u/3676859?u=a866d19c4fce64bf67a084eb32f29bb6e84020a5&v=4"
      },
      {
        "repo": "node-fetch",
        "avatarUrl": "https://avatars.githubusercontent.com/u/59502381?v=4"
      }
    ]
  }
}
```

## Include repo owner's name - `discussions.nameWithOwner`

Note: requires `discussions.listRepo`.

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1&discussions.nameWithOwner=1](https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1&discussions.nameWithOwner=1)

```json
{
  "discussions": {
    "started": { "totalCount": 25 },
    "comments": { "totalCount": 410 },
    "answers": { "totalCount": 49 },
    "repoList": [
      {
        "repo": "vercel/next.js",
        "avatarUrl": "https://avatars.githubusercontent.com/u/14985020?v=4"
      },
      {
        "repo": "shuding/nextra",
        "avatarUrl": "https://avatars.githubusercontent.com/u/3676859?u=a866d19c4fce64bf67a084eb32f29bb6e84020a5&v=4"
      },
      {
        "repo": "node-fetch/node-fetch",
        "avatarUrl": "https://avatars.githubusercontent.com/u/59502381?v=4"
      }
    ]
  }
}
```

## Limit by user's answered discussions - `discussions.onlyAnswers`

Note: requires `discussions.listRepo`.

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1&discussions.onlyAnswers=1](https://gh-insights.vercel.app/api?username=devjiwonchoi&discussions=1&discussions.listRepo=1&discussions.onlyAnswers=1)

```json
{
  "discussions": {
    "started": { "totalCount": 25 },
    "comments": { "totalCount": 410 },
    "answers": { "totalCount": 49 },
    "repoList": [
      {
        "repo": "next.js",
        "avatarUrl": "https://avatars.githubusercontent.com/u/14985020?v=4"
      },
      {
        "repo": "nextra",
        "avatarUrl": "https://avatars.githubusercontent.com/u/3676859?u=a866d19c4fce64bf67a084eb32f29bb6e84020a5&v=4"
      }
    ]
  }
}
```
