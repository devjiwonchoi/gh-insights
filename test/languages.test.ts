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
    expect(response.body).toHaveProperty('languages')

    const { languages } = response.body

    languages.forEach((lang: any, index: number) => {
      expect(lang).toHaveProperty('language')
      expect(lang).toHaveProperty('size')
      expect(lang).toHaveProperty('color')

      // Check if the languages are in desc order
      if (index > 0) {
        expect(languages[index - 1].size).toBeGreaterThanOrEqual(lang.size)
      }
    })
  })
})

describe('Top languages with limit', () => {
  it('should return languages with given limit', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&languages=1&languages.limit=3',
    )
    expect(response.status).toBe(200)

    const { languages } = response.body

    expect(languages.length).toBe(3)
  })
})

describe('Top languages with excludes languages', () => {
  it('should return languages without excludes languages', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&languages=1&languages.excludes=html,css',
    )
    expect(response.status).toBe(200)

    const { languages } = response.body

    languages.forEach(({ language }) => {
      expect(language).not.toEqual('HTML')
      expect(language).not.toEqual('CSS')
    })
  })
})
