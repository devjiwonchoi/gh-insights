import { fetcher, graphqlParser } from '../../utils'

function handleNodes(
  nodes: any[],
  stars?: string,
  accountType?: string,
  ignored?: string,
) {
  const contribsMap = new Map<string, string>()

  nodes.forEach((node: any) => {
    const {
      stargazerCount,
      isInOrganization,
      name,
      owner: { login, avatarUrl },
    } = node

    if (stars) {
      const starsNumber = Number(stars)
      if (stargazerCount < starsNumber) return
    }

    // if accountType is 'all', pass all repos. else, pass only isInOrganization repos
    if (accountType !== 'all' && !isInOrganization) return

    if (ignored) {
      const ignoredArray = ignored.split(',').map((name) => name.toLowerCase())
      if (
        ignoredArray.includes(name.toLowerCase()) ||
        ignoredArray.includes(login.toLowerCase())
      )
        return
    }

    if (node.nameWithOwner) {
      contribsMap.set(node.nameWithOwner, avatarUrl)
    } else {
      contribsMap.set(name, avatarUrl)
    }
  })

  const contribs = Array.from(contribsMap.entries()).map(
    ([name, avatarUrl]) => ({
      name,
      avatarUrl,
    }),
  )

  return contribs
}

async function getUserContributions(variables: any) {
  const defaultQuery = await graphqlParser('contributions', 'default.gql')
  let nodesArray: any[] = []
  // init loop
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
    variables = { ...variables, cursor: endCursor }
    hasNextPage = newHasNextPage
  }

  return nodesArray
}

export default async function resolveRequestQueries({
  login,
  stars,
  owner,
  accountType,
  ignored,
  type,
}: {
  login: string
  stars: string
  owner: string
  accountType: string
  ignored: string
  type: string
}) {
  let variables: Record<string, any> = { login }
  let contributionTypes: string[] = []
  if (type) {
    contributionTypes = type.split(',').map((el) => {
      if (el === 'pull') return 'PULL_REQUEST'
      if (el === 'repo') return 'REPOSITORY'
      if (el === 'review') return 'PULL_REQUEST_REVIEW'

      return el.toUpperCase()
    })
  } else {
    contributionTypes = [
      'COMMIT',
      'ISSUE',
      'PULL_REQUEST',
      'REPOSITORY',
      'PULL_REQUEST_REVIEW',
    ]
  }
  variables.contributionTypes = contributionTypes

  if (owner) variables = { ...variables, owner: true }

  const nodesArray = await getUserContributions(variables)

  return handleNodes(nodesArray, stars, accountType, ignored)
}
