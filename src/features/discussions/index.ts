import { fetcher, graphqlParser } from '../../utils'

async function handleNodes(nodes: any[]) {
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

async function getUserDiscussions(query: string, variables: any) {
  let nodesArray: any[] = []
  let hasNextPage = true

  while (hasNextPage) {
    const {
      data: {
        user: {
          repo: {
            nodes,
            pageInfo: { hasNextPage: newHasNextPage, endCursor },
          },
        },
      },
    } = await fetcher(query, variables)
    nodesArray = [...nodesArray, ...nodes]
    variables = { ...variables, cursor: endCursor }
    hasNextPage = newHasNextPage
  }

  return await handleNodes(nodesArray)
}

export default async function resolveRequestQueries({
  login,
  listRepo = false,
  onlyAnswers = false,
}: {
  login: string
  listRepo: boolean
  onlyAnswers: boolean
}) {
  const defaultQuery = await graphqlParser('discussions', 'default.gql')
  const withRepoQuery = await graphqlParser('discussions', 'with-repo.gql')
  let variables: Record<string, any> = { login, onlyAnswers }

  if (listRepo) {
    return await getUserDiscussions(withRepoQuery, variables)
  }

  const {
    data: { user },
  } = await fetcher(defaultQuery, variables)

  return user
}
