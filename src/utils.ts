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

export function handleLanguages(
  nodes: any[],
  limit?: string,
  ignored?: string,
) {
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

  let langs = Array.from(languagesMap.entries())
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

  if (limit) {
    const limitNumber = Number(limit)
    langs.splice(limitNumber)
  }

  if (ignored) {
    const ignoredArray = ignored.split(',').map((lang) => lang.toLowerCase())
    langs = langs.filter(
      (lang) => !ignoredArray.includes(lang.name.toLowerCase()),
    )
  }

  return { langs, langColors }
}
