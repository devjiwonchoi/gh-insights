import fs from 'fs/promises'
import path from 'path'
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

export async function graphqlParser(
  featureName: string,
  filename: string,
): Promise<string> {
  const resolvedFilepath = path.join(
    __dirname,
    'features',
    featureName,
    filename,
  )
  const file = await fs.readFile(resolvedFilepath, 'utf-8')

  const query = file
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/"/g, '\\"')

  return query
}
