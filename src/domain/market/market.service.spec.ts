import { MarketService } from './market.service'

describe('MarketService transient upstream handling', () => {
  it('throws a service unavailable error when the block upstream returns null data', async () => {
    const service = new MarketService()

    ;(service as any)._murray = {
      blockchain: { getBlock: jest.fn().mockResolvedValueOnce({ data: null }) },
      prices: {
        getTicker: jest
          .fn()
          .mockResolvedValueOnce({ symbol: 'BTCUSDT', price: 60000 })
          .mockResolvedValueOnce({ symbol: 'BTCBRL', price: 300000 }),
      },
    }

    await expect(service.getMarketCap()).rejects.toThrow('Murray upstream returned no data for blockchain block')
  })

  it('times out instead of hanging when the block upstream never responds', async () => {
    jest.useFakeTimers()
    const service = new MarketService()

    ;(service as any)._murray = {
      blockchain: { getBlock: jest.fn().mockReturnValueOnce(new Promise(() => undefined)) },
      prices: {
        getTicker: jest
          .fn()
          .mockResolvedValueOnce({ symbol: 'BTCUSDT', price: 60000 })
          .mockResolvedValueOnce({ symbol: 'BTCBRL', price: 300000 }),
      },
    }

    const result = service.getMarketCap()
    jest.advanceTimersByTime(10000)
    await Promise.resolve()

    await expect(result).rejects.toThrow('Murray upstream timed out for blockchain block')
    jest.useRealTimers()
  })

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
