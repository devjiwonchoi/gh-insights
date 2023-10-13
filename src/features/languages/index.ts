import { fetcher, graphqlParser } from '../../utils'
import { QueryVariables } from '../../types'

function resolveLanguagesNodes(nodes: any[], limit: number, excludes?: string) {
  const languagesMap = new Map<
    string,
    {
      language: string
      size: number
      color: string
    }
  >()

  nodes.forEach(({ languages: { edges } }: any) => {
    edges.forEach(({ size, node: { name: language, color } }: any) => {
      if (languagesMap.has(language)) {
        const currentSize = languagesMap.get(language)?.size
        languagesMap.set(language, {
          language,
          size: currentSize + size,
          color,
        })
      } else {
        languagesMap.set(language, { language, size, color })
      }
    })
  })

  let languages = Array.from(languagesMap.values())

  if (excludes) {
    const excludesArray = excludes
      .split(',')
      .map((language) => language.toLowerCase())

    languages = languages.filter(
      ({ language }) => !excludesArray.includes(language.toLowerCase()),
    )
  }

  languages.sort((a, b) => b.size - a.size)
  // TODO: find a way to query with limit
  languages = languages.slice(0, limit)

  return languages
}

export async function fetchLanguagesData({
  variables,
  // default limit is 6
  limit = '6',
  excludes,
}: {
  variables: QueryVariables
  limit: string
  excludes?: string
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

  return resolveLanguagesNodes(nodesArray, parseInt(limit), excludes)
}
