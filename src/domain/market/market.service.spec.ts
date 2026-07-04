import { MarketService } from './market.service'

describe('MarketService transient upstream handling', () => {
  it('retries transient block fetch failures before calculating market capitalization', async () => {
    const service = new MarketService()
    const getBlock = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to fetch block: Error: read ECONNRESET'))
      .mockResolvedValueOnce({ data: { height: 840000 } })

    ;(service as any)._murray = {
      blockchain: { getBlock },
      prices: {
        getTicker: jest
          .fn()
          .mockResolvedValueOnce({ symbol: 'BTCUSDT', price: 60000 })
          .mockResolvedValueOnce({ symbol: 'BTCBRL', price: 300000 }),
      },
    }

    await expect(service.getMarketCap()).resolves.toMatchObject({
      title: '💰 Market Capitalization',
    })
    expect(getBlock).toHaveBeenCalledTimes(2)
  })
})
