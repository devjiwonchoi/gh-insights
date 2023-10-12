import { fetcher, graphqlParser } from '../../utils'

function handleNodes(nodes: any[], limit?: string, ignored?: string) {
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

  let languages = Array.from(languagesMap.entries())
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
    languages.splice(limitNumber)
  }

  if (ignored) {
    const ignoredArray = ignored.split(',').map((lang) => lang.toLowerCase())
    languages = languages.filter(
      (lang) => !ignoredArray.includes(lang.name.toLowerCase()),
    )
  }

  return { languages, langColors }
}

async function getUserLanguages(variables: any) {
  const defaultQuery = await graphqlParser('languages', 'default.gql')
  let nodesArray: any[] = []
  let hasNextPage = true

  while (hasNextPage) {
    const {
      data: {
        user: {
          ownerRepo: {
            nodes,
            pageInfo: { hasNextPage: newHasNextPage, endCursor },
          },
        },
      },
    } = await fetcher(defaultQuery, variables)
    nodesArray = [...nodesArray, ...nodes]
    variables = { ...variables, cursor: endCursor }
    hasNextPage = newHasNextPage
  }

  return nodesArray
}

export default async function resolveRequestQueries({
  login,
  limit,
  ignored,
}: {
  login: string
  limit?: string
  ignored?: string
}) {
  const nodes = await getUserLanguages({ login })

  const result = handleNodes(nodes, limit, ignored)

  return result
}
