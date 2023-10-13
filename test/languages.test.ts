import { mockRequest } from './test-utils'

describe('Languages Insights API', () => {
  it('should support basic API', async () => {
    const res = await mockRequest('&languages=1')

    expect(res.body).toHaveProperty('languages')

    const { languages } = res.body

    expect(Array.isArray(languages)).toBe(true)
    expect(languages.length).toBe(6)

    languages.forEach((language: any) => {
      expect(language).toHaveProperty('language')
      expect(language).toHaveProperty('size')
      expect(language).toHaveProperty('color')
    })
  })

  it('should support limit', async () => {
    const res = await mockRequest('&languages=1&languages.limit=2')

    const { languages } = res.body

    expect(languages.length).toBe(2)
  })

  it('should support limit over default limit', async () => {
    const res = await mockRequest('&languages=1&languages.limit=7')

    const { languages } = res.body

    expect(languages.length).toBe(7)
  })

  it('should support excludes', async () => {
    const res = await mockRequest(
      '&languages=1&languages.excludes=javascript,typescript',
    )

    const { languages } = res.body

    expect(
      languages.every(
        ({ language }: { language: string }) =>
          language !== 'JavaScript' && language !== 'TypeScript',
      ),
    ).toBe(true)
  })
})
