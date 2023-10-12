import { fetcher, graphqlParser } from '../../utils'

function resolveLanguagesNodes(nodes: any[], limit: number, ignored?: string) {
  const languagesMap = new Map<string, any>()
  const languagesColorsMap = new Map<string, any>()

  nodes.forEach((node: any) => {
    const {
      languages: { edges },
    } = node

    edges.forEach((edge: any) => {
      const { size, node } = edge
      const { name: language, color } = node

      if (languagesMap.has(language)) {
        const currentSize = languagesMap.get(language).size
        languagesMap.set(language, { language, size: currentSize + size })
      } else {
        languagesMap.set(language, { language, size })
      }

      if (!languagesColorsMap.has(language)) {
        languagesColorsMap.set(language, { language, color })
      }
    })
  })

  let languages = Array.from(languagesMap.values())
  let languageColors = Array.from(languagesColorsMap.values())

  if (ignored) {
    const excludesArray = ignored
      .split(',')
      .map((language) => language.toLowerCase())

    languages = languages.filter(
      ({ language }) => !excludesArray.includes(language.toLowerCase()),
    )

    languageColors = languageColors.filter(
      ({ language }) => !excludesArray.includes(language.toLowerCase()),
    )
  }

  languages.sort((a, b) => b.size - a.size)
  // TODO: find a way to query with limit
  languages = languages.slice(0, limit)

  return { languages, languageColors }
}

export async function fetchLanguagesData({
  variables,
  // default limit is 6
  limit = '6',
  ignored,
}: {
  // TODO: type variables
  variables: any
  limit: string
  ignored?: string
}) {
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
    variables.cursor = endCursor
    hasNextPage = newHasNextPage
  }

  return resolveLanguagesNodes(nodesArray, parseInt(limit), ignored)
}
