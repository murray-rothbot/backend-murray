import { Injectable } from '@nestjs/common'
import Murray from 'murray-js'

import { MessageResponseDto } from '../../shared/dtos'

import { formatBRL, formatSATS, formatUSD, kFormatter, calculateSupply } from 'src/shared/utils'

@Injectable()
export class MarketService {
  _murray = new Murray()

  constructor() {}

  async getTicker({ symbol }) {
    return this._murray.prices.getTicker({ symbol: symbol.toUpperCase() })
  }

  async getMarketCap(): Promise<MessageResponseDto> {
    const requests = []

    // Get current block
    const block = this._murray.blockchain.getBlock()

    requests.push(block)

    // Get current prices
    const currencies = {
      btcusd: {
        singular: 'Dollar',
        plural: 'Dollars',
        formatter: formatUSD,
        flag: '🇺🇸',
      },
      btcbrl: {
        singular: 'Real',
        plural: 'Reais',
        formatter: formatBRL,
        flag: '🇧🇷',
      },
    }

    requests.push(...Object.keys(currencies).map((symbol) => this.getTicker({ symbol })))

    // Run all requests in parallel
    const data = await Promise.all(requests)

    const {
      data: { height },
    } = data.shift()
    const supply = calculateSupply(height)

    const fields = {}
    for (const { symbol, price } of data) {
      const symbolKey = symbol.toLowerCase() === 'btcusdt' ? 'btcusd' : symbol.toLowerCase()
      const { singular, plural, formatter, flag } = currencies[symbolKey]

      const sats = Math.round(1e8 / price)
      const market = Math.round(supply * price)

      fields[symbol.toLowerCase()] = {
        value: {
          price: {
            description: `${flag} Price in ${plural}`,
            value: formatter(price),
          },
          satsPerFiat: {
            description: `⚡ Sats per ${singular}`,
            value: formatSATS(sats),
          },
          marketCap: {
            description: `💰 Market Cap`,
            value: kFormatter(market, formatter),
          },
        },
      }
    }

    return {
      title: '💰 Market Capitalization',
      fields,
    }
  }
}
