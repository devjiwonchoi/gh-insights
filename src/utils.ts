import { TOKEN } from './constants'

export async function fetcher(
  query: string,
  variables: Record<string, string>,
) {
  const response = await fetch('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
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

export function handleLanguages(nodes: any[]) {
  const languagesMap = new Map<string, number>()
  const languagesColorsMap = new Map<string, string>()

  nodes.forEach((node: any) => {
    const {
      languages: { edges },
    } = node

    edges.forEach((edge: any) => {
      const { size, node: lang } = edge
      const { name, color } = lang

      if (languagesMap.has(name)) {
        const currentSize = languagesMap.get(name)
        languagesMap.set(name, currentSize + size)
      } else {
        languagesMap.set(name, size)
      }

      if (!languagesColorsMap.has(name)) {
        languagesColorsMap.set(name, color)
      }
    })
  })

  const langs = Array.from(languagesMap.entries())
    .map(([name, size]) => ({
      name,
      size,
    }))
    .sort((a, b) => b.size - a.size)

  const langColors = Array.from(languagesColorsMap.entries()).map(
    ([name, color]) => ({
      name,
      color,
    }),
  )

  return { langs, langColors }
}
