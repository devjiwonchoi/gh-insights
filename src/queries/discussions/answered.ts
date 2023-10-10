// TODO: convert to export/import as .graphql file
export const answered = `query ($login: String!, $cursor: String, $listRepo: Boolean!) {
  user(login: $login) {
    name
    login
    repositoryDiscussionComments(
      onlyAnswers: true
      first: 100
      after: $cursor
    ) {
      totalCount
      nodes @include(if: $listRepo) {
        url
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`
