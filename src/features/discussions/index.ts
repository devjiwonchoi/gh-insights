import { fetcher, graphqlParser } from '@/utils'
import { QueryVariables } from '@/types'

function resolveDiscussionsNodes(nodes: any[]) {
  const reposMap = new Map<
    string,
    {
      repo: string
      avatarUrl: string
    }
  >()

  nodes.forEach(
    ({
      discussion: {
        repository: {
          name,
          nameWithOwner,
          owner: { avatarUrl },
        },
      },
    }: any) => {
      if (nameWithOwner) {
        reposMap.set(nameWithOwner, { repo: nameWithOwner, avatarUrl })
      } else {
        reposMap.set(name, { repo: name, avatarUrl })
      }
    },
  )

  return Array.from(reposMap.values())
}

async function fetchDiscussionsRepoList(variables: QueryVariables) {
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
  variables: QueryVariables
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
