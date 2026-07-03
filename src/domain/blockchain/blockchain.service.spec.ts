import { ServiceUnavailableException } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'

describe('BlockchainService upstream null handling', () => {
  it('throws a service-unavailable error instead of TypeError when halving block data is null', async () => {
    const service = new BlockchainService()
    ;(service as any)._murray = { blockchain: { getBlock: jest.fn().mockResolvedValue({ data: null }) } }

    await expect(service.getHalving()).rejects.toBeInstanceOf(ServiceUnavailableException)
    await expect(service.getHalving()).rejects.toThrow('Murray upstream returned no data for blockchain block')
  })

  it('throws a service-unavailable error instead of TypeError when recommended fees data is null', async () => {
    const service = new BlockchainService()
    ;(service as any)._murray = { blockchain: { getFeesRecommended: jest.fn().mockResolvedValue({ data: null }) } }

    await expect(service.getFeesRecommended()).rejects.toBeInstanceOf(ServiceUnavailableException)
    await expect(service.getFeesRecommended()).rejects.toThrow('Murray upstream returned no data for recommended fees')
  })
})
