import { TOKEN } from './constants'

export async function fetcher(
  query: string,
  variables: Record<string, string>,
) {
  const response = await fetch('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  })

  return await response.json()
}

export function handleContributions(
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

  return { contribs }
}
