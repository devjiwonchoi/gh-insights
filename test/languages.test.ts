import request from 'supertest'
import app from '../api'

describe('Basic top languages insights', () => {
  it('should return langs in desc order and their colors', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&languages=1',
    )
    expect(response.status).toBe(200)
    // TODO: Replace this to `image/svg+xml` when we return SVG
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveProperty('langs')
    expect(response.body).toHaveProperty('langColors')

    const { langs, langColors } = response.body

    langs.forEach((lang: any, index: number) => {
      expect(lang).toHaveProperty('name')
      expect(lang).toHaveProperty('size')

      // Check if the langs are in desc order
      if (index > 0) {
        expect(langs[index - 1].size).toBeGreaterThanOrEqual(lang.size)
      }
    })

    langColors.forEach((langColor: any) => {
      expect(langColor).toHaveProperty('name')
      expect(langColor).toHaveProperty('color')
    })
  })
})

describe('Top languages with limit', () => {
  it('should return langs with given limit', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&languages=1&languages.limit=3',
    )
    expect(response.status).toBe(200)

    const { langs } = response.body

    expect(langs.length).toBe(3)
  })
})

describe('Top languages with ignored languages', () => {
  it('should return langs without ignored languages', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&languages=1&languages.ignored=html,css',
    )
    expect(response.status).toBe(200)

    const { langs } = response.body

    langs.forEach((lang: any) => {
      expect(lang.name).not.toEqual('HTML')
      expect(lang.name).not.toEqual('CSS')
    })
  })
})
