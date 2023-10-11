// TODO: convert to export/import as .graphql file
const basic = `
  query ($login: String!) {
    user(login: $login) {
      name
      login
      started: repositoryDiscussions {
        totalCount
      }
      comments: repositoryDiscussionComments {
        totalCount
      }
      answers: repositoryDiscussionComments(onlyAnswers: true) {
        totalCount
      }
    }
  }
`

const repo = `
  query ($login: String!, $onlyAnswers: Boolean!, $cursor: String) {
    user(login: $login) {
      repo: repositoryDiscussionComments(first:100, after: $cursor, onlyAnswers: $onlyAnswers) {
        nodes {
          discussion {
            repository {
              nameWithOwner
              owner {
                avatarUrl
              }
            }
          }
        }
        pageInfo { 
          hasNextPage
          endCursor
        }
      }
    }
  }
`

export { basic as default, repo }