# Languages API Response JSON Schema

## Base - `languages`

By default, returns repos created by organizations.

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&languages=1](https://gh-insights.vercel.app/api?username=devjiwonchoi&languages=1)

```json
{
  "languages": [
    { "language": "TypeScript", "size": 185650, "color": "#3178c6" },
    { "language": "Rust", "size": 13917, "color": "#dea584" },
    { "language": "JavaScript", "size": 11461, "color": "#f1e05a" },
    { "language": "CSS", "size": 8950, "color": "#563d7c" },
    { "language": "MDX", "size": 1737, "color": "#fcb32c" },
    { "language": "HTML", "size": 1640, "color": "#e34c26" }
  ]
}
```

## Limit by number - `languages.limit`

Note: default limit is 6.

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&languages=1&languages.limit=3](https://gh-insights.vercel.app/api?username=devjiwonchoi&languages=1&languages.limit=3)

```json
{
  "languages": [
    { "language": "TypeScript", "size": 185650, "color": "#3178c6" },
    { "language": "Rust", "size": 13917, "color": "#dea584" },
    { "language": "JavaScript", "size": 11461, "color": "#f1e05a" }
  ]
}
```

## Exclude certain languages - `languages.excludes`

Note: case-insensitive.

> [https://gh-insights.vercel.app/api?username=devjiwonchoi&languages=1&languages.excludes=html,css,MDX,SHELL](https://gh-insights.vercel.app/api?username=devjiwonchoi&languages=1&languages.excludes=html,css,MDX,SHELL)

```json
{
  "languages": [
    { "language": "TypeScript", "size": 185650, "color": "#3178c6" },
    { "language": "Rust", "size": 13917, "color": "#dea584" },
    { "language": "JavaScript", "size": 11461, "color": "#f1e05a" }
  ]
}
```
