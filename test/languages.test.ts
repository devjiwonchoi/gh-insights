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
    expect(response.body).toHaveProperty('langColors')

    const { languages, langColors } = response.body

    languages.forEach((lang: any, index: number) => {
      expect(lang).toHaveProperty('name')
      expect(lang).toHaveProperty('size')

      // Check if the languages are in desc order
      if (index > 0) {
        expect(languages[index - 1].size).toBeGreaterThanOrEqual(lang.size)
      }
    })

    langColors.forEach((langColor: any) => {
      expect(langColor).toHaveProperty('name')
      expect(langColor).toHaveProperty('color')
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

describe('Top languages with ignored languages', () => {
  it('should return languages without ignored languages', async () => {
    const response = await request(app).get(
      '/api?username=devjiwonchoi&languages=1&languages.ignored=html,css',
    )
    expect(response.status).toBe(200)

    const { languages } = response.body

    languages.forEach((lang: any) => {
      expect(lang.name).not.toEqual('HTML')
      expect(lang.name).not.toEqual('CSS')
    })
  })
})
