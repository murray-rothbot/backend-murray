import { ServiceUnavailableException } from '@nestjs/common'
import { PricesService } from './prices.service'

describe('PricesService upstream handling', () => {
  it('retries a transient ticker request failure once', async () => {
    const service = new PricesService()
    const getTicker = jest
      .fn()
      .mockRejectedValueOnce(new Error('read ECONNRESET'))
      .mockResolvedValue({ price: '62000', change24h: '1.5' })
    ;(service as any)._murray = { prices: { getTicker } }

    await expect(service.getRawTickers()).resolves.toMatchObject({
      USD: { lastPrice: '62000' },
      BRL: { lastPrice: '62000' },
    })
    expect(getTicker).toHaveBeenCalledTimes(3)
  })

  it('throws a service-unavailable error instead of TypeError when raw ticker data is null', async () => {
    const service = new PricesService()
    ;(service as any)._murray = { prices: { getTicker: jest.fn().mockResolvedValue(null) } }

    await expect(service.getRawTickers()).rejects.toBeInstanceOf(ServiceUnavailableException)
    await expect(service.getRawTickers()).rejects.toThrow('Murray upstream returned no data for BTCUSD ticker')
  })

  it('throws a service-unavailable error instead of TypeError when formatted ticker data is null', async () => {
    const service = new PricesService()
    ;(service as any)._murray = { prices: { getTicker: jest.fn().mockResolvedValue(null) } }

    await expect(service.getTickers()).rejects.toBeInstanceOf(ServiceUnavailableException)
    await expect(service.getTickers()).rejects.toThrow('Murray upstream returned no data for BTCUSD ticker')
  })
})
