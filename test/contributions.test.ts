import request from 'supertest'
import app from '../api'

describe('Contributions insights', () => {
  it('should return basic', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contributions')

    const { contributions } = response.body

    contributions.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('repo')
      expect(contrib).toHaveProperty('avatarUrl')
    })
  })

  it('should filter by repoStars', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.repoStars=100',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contributions')

    const { contributions } = response.body

    contributions.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('repo')
      expect(contrib).toHaveProperty('avatarUrl')
    })
  })

  it('should support includeUserRepo', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.includeUserRepo=1',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contributions')

    const { contributions } = response.body

    expect(contributions.some(({ repo }) => repo === 'bunchee')).toBe(true)
  })

  it('should support nameWithOwner', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.nameWithOwner=1',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contributions')

    const { contributions } = response.body

    contributions.forEach((contrib: any) => {
      expect(contrib).toHaveProperty('repo')
      expect(contrib).toHaveProperty('avatarUrl')
      expect(contrib.repo).toContain('/')
    })
  })

  it('should support excludes repos', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&contributions=1&contributions.repoExcludes=next.js',
    )
    expect(response.status).toBe(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('contributions')

    const { contributions } = response.body

    contributions.forEach((contrib) => {
      expect(contrib).toHaveProperty('repo')
      expect(contrib).toHaveProperty('avatarUrl')
      expect(contrib.repo).not.toContain('next.js')
    })
  })
})
