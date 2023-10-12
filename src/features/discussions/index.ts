import { fetcher, graphqlParser } from '../../utils'

async function resolveDiscussionsNodes(nodes: any[]) {
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

async function fetchDiscussionsRepoLists(query: string, variables: any) {
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

  return await resolveDiscussionsNodes(nodesArray)
}

export async function fetchDiscussionsData({
  variables,
  listRepo = false,
}: {
  // TODO: type variables
  variables: any
  listRepo: boolean
}) {
  const defaultQuery = await graphqlParser('discussions', 'default.gql')
  const withRepoQuery = await graphqlParser('discussions', 'with-repo.gql')

  if (listRepo) {
    return await fetchDiscussionsRepoLists(withRepoQuery, variables)
  }

  const {
    data: { user },
  } = await fetcher(defaultQuery, variables)

  return user
}
