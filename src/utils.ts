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

export function handleDiscussionsRepo(nodes: any[]) {
  const reposMap = new Map<
    string,
    { nameWithOwner: string; avatarUrl: string }
  >()

  nodes.forEach((node: any) => {
    const {
      discussion: {
        repository: {
          nameWithOwner,
          owner: { avatarUrl },
        },
      },
    } = node

    reposMap.set(nameWithOwner, { nameWithOwner, avatarUrl })
  })

  return Array.from(reposMap.values())
}