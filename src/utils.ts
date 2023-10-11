import { GITHUB_ACCESS_TOKEN } from './constants'

export async function fetcher(
  query: string,
  variables: Record<string, string>
) {
  const response = await fetch('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    },
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  })

  return await response.json()
}
