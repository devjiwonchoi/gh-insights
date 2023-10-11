import request from 'supertest'
import app from '../api'

describe('Basic discussions insights', () => {
  it('should return name, login, started, comments, and answers', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&discussions=1',
    )
    expect(response.status).toBe(200)
    // TODO: Replace this to `image/svg+xml` when we return SVG
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('login')
    expect(response.body).toHaveProperty('started')
    expect(response.body).toHaveProperty('comments')
    expect(response.body).toHaveProperty('answers')
  })
})

describe('Repos', () => {
  it('should return nameWithOwner and avatarUrl of all participated discussions', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&discussions=1&discussions.repo=all',
    )
    expect(response.status).toBe(200)
    // TODO: Replace this to `image/svg+xml` when we return SVG
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('repos')

    const { repos } = response.body

    repos.forEach((repo: any) => {
      expect(repo).toHaveProperty('nameWithOwner')
      expect(repo).toHaveProperty('avatarUrl')
    })
  })

  it('should return nameWithOwner and avatarUrl of answered discussions', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&discussions=1&discussions.repo=answered',
    )
    expect(response.status).toBe(200)
    // TODO: Replace this to `image/svg+xml` when we return SVG
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('repos')

    const { repos } = response.body

    repos.forEach((repo: any) => {
      expect(repo).toHaveProperty('nameWithOwner')
      expect(repo).toHaveProperty('avatarUrl')
    })
  })
})
