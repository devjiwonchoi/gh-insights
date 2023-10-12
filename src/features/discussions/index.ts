import { fetcher, graphqlParser } from '../../utils'

function resolveDiscussionsNodes(nodes: any[]) {
  // TODO: type this
  const reposMap = new Map<string, any>()

  nodes.forEach((node: any) => {
    const {
      discussion: {
        repository: {
          name,
          nameWithOwner,
          owner: { avatarUrl },
        },
      },
    } = node

    if (nameWithOwner) {
      reposMap.set(nameWithOwner, { repo: nameWithOwner, avatarUrl })
    } else {
      reposMap.set(name, { repo: name, avatarUrl })
    }
  })

  return Array.from(reposMap.values())
}

// TODO: type variables
async function fetchDiscussionsRepoList(query: string, variables: any) {
  let nodesArray: any[] = []
  let hasNextPage = true

  while (hasNextPage) {
    const {
      data: {
        user: {
          repositoryDiscussionComments: {
            nodes,
            pageInfo: { hasNextPage: newHasNextPage, endCursor },
          },
        },
      },
    } = await fetcher(query, variables)

    nodesArray = [...nodesArray, ...nodes]
    variables.cursor = endCursor
    hasNextPage = newHasNextPage
  }

  return resolveDiscussionsNodes(nodesArray)
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
  const listRepoQuery = await graphqlParser('discussions', 'list-repo.gql')

  if (listRepo) {
    return await fetchDiscussionsRepoList(listRepoQuery, variables)
  }

  const {
    data: { user: discussionsData },
  } = await fetcher(defaultQuery, variables)

  return discussionsData
}
