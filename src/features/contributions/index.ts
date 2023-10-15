import { ContributionType, QueryVariables } from '../../types'
import { fetcher, graphqlParser } from '../../utils'

function resolveContributionsNodes(
  nodes: any[],
  repoStars: number,
  repoExcludesArray: string[],
  includeUserRepo: boolean,
) {
  const contribsMap = new Map<
    string,
    {
      repo: string
      avatarUrl: string
    }
  >()

  nodes.forEach((node: any) => {
    const {
      stargazerCount,
      isInOrganization,
      name,
      nameWithOwner,
      owner: { login, avatarUrl },
    } = node

    if (stargazerCount < repoStars) return

    if (!includeUserRepo && !isInOrganization) return

    // TODO: Refactor to shorter code
    if (repoExcludesArray.length > 0) {
      const repoName = name.toLowerCase()
      const repoOwner = login.toLowerCase()
      const repoNameWithOwner = nameWithOwner ? nameWithOwner.toLowerCase() : ''

      if (
        repoExcludesArray.some(
          (excluded) =>
            excluded === repoName ||
            excluded === repoOwner ||
            excluded === repoNameWithOwner,
        )
      ) {
        return
      }
    }

    contribsMap.set(name, {
      repo: nameWithOwner ? nameWithOwner : name,
      avatarUrl,
    })
  })

  return Array.from(contribsMap.values())
}

function handleContributionTypes(
  contributionTypes: string,
): ContributionType[] {
  const contributionTypesArray = contributionTypes.split(',').map((type) => {
    type = type.trim().toUpperCase()
    switch (type) {
      case 'COMMIT':
        return type
      case 'ISSUE':
        return type
      case 'PULL':
        return 'PULL_REQUEST'
      case 'REPO':
        return 'REPOSITORY'
      case 'REVIEW':
        return 'PULL_REQUEST_REVIEW'
      default:
        throw new Error(
          `Invalid contribution type: ${type}. Valid types are: commit, issue, pull, repo, review`,
        )
    }
  })

  return contributionTypesArray
}

export async function fetchContributionsData({
  variables,
  repoStars = '0',
  repoExcludes,
  contributionTypes = 'commit,issue,pull,repo,review',
  includeUserRepo,
}: {
  variables: QueryVariables
  repoStars: string
  repoExcludes: string
  contributionTypes: string
  includeUserRepo: boolean
}) {
  const contributionTypesArray = handleContributionTypes(contributionTypes)
  variables.contributionTypes = contributionTypesArray

  const defaultQuery = await graphqlParser('contributions', 'default.gql')
  let nodesArray: any[] = []
  let hasNextPage = true

  while (hasNextPage) {
    const {
      data: {
        user: {
          repositoriesContributedTo: {
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

  const repoExcludesArray = repoExcludes
    ? repoExcludes.split(',').map((name) => name.trim().toLowerCase())
    : []

  return resolveContributionsNodes(
    nodesArray,
    parseInt(repoStars),
    repoExcludesArray,
    includeUserRepo,
  )
}
