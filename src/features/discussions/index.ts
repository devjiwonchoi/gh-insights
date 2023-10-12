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
async function fetchDiscussionsRepoList(variables: any) {
  const listRepoQuery = await graphqlParser('discussions', 'list-repo.gql')

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
    } = await fetcher(listRepoQuery, variables)

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

  const {
    data: { user },
  } = await fetcher(defaultQuery, variables)

  let discussionsData = { ...user }

  if (listRepo) {
    const repoList = await fetchDiscussionsRepoList(variables)
    discussionsData = { ...discussionsData, repoList }
  }

  return discussionsData
}
