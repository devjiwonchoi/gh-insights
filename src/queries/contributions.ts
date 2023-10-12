const basic = `
  query ($login: String!, $cursor: String, $contributionTypes: [RepositoryContributionType], $owner: Boolean = false) {
    user(login: $login) {
      repositoriesContributedTo(
        first: 100,
        after: $cursor,
        contributionTypes: $contributionTypes,
      ) {
        totalCount
        nodes {
          stargazerCount
          isInOrganization
          name
          nameWithOwner @include(if: $owner)
          owner {
            avatarUrl
            login
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`

export { basic as default }
