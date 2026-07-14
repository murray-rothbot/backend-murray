import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import Murray from 'murray-js'

import { MessageResponseDto } from '../../shared/dtos'

import { formatBRL, formatBTC, formatSATS, formatUSD, kFormatter } from '../../shared/utils'

@Injectable()
export class PricesService {
  _murray = new Murray()

  constructor() {}

  private async getTicker(symbol: 'BTCUSD' | 'BTCBRL'): Promise<any> {
    try {
      return await this._murray.prices.getTicker({ symbol })
    } catch {
      return await this._murray.prices.getTicker({ symbol })
    }
  }

  private requireTicker<T>(data: T | null | undefined, symbol: string): T {
    if (data == null) {
      throw new ServiceUnavailableException(`Murray upstream returned no data for ${symbol} ticker`)
    }
    return data
  }

  async getRawTickers(): Promise<MessageResponseDto> {
    const tickers = [{ currency: 'USD' }, { currency: 'BRL' }]

    let response: any = {}

    for (const { currency } of tickers) {
      const ticker = await this.getTicker(`BTC${currency}` as 'BTCUSD' | 'BTCBRL')
      const { price, change24h } = this.requireTicker(ticker, `BTC${currency}`)

      response[currency] = {
        priceChangePercent: change24h,
        lastPrice: price,
        formattedLastPrice: kFormatter(price),
      }
    }

    return response
  }

  async getTickers(): Promise<MessageResponseDto> {
    const tickers = [
      { currency: 'USD', flag: '🇺🇸' },
      { currency: 'BRL', flag: '🇧🇷' },
    ]

    const response = {
      title: '💵 Bitcoin Fiat Price',
      description: '',
      fields: {},
    }

    for (const { currency, flag } of tickers) {
      const ticker = await this.getTicker(`BTC${currency}` as 'BTCUSD' | 'BTCBRL')
      const { price, symbol, source, change24h } = this.requireTicker(ticker, `BTC${currency}`)

      const name = `${flag} ${symbol}`
      const arrow = change24h > 0 ? '🔼' : '🔽'
      const change_str = `${(+change24h).toFixed(2)}%`

      const price_str = currency === 'USD' ? formatUSD(+price) : formatBRL(+price)
      const value = `${arrow} ${change_str}\n ${price_str}\nSource: ${source}`

      response.fields[currency] = { description: name, value: value }
    }

    return response
  }

  async convert({ currency, value }): Promise<any> {
    const { btc, sat, usd, brl } = await this._murray.prices.convertCurrency({ currency, value })

    return {
      title: '↔️ Conversion',
      description: '',
      fields: {
        height: {
          description: '🟠 Bitcoin',
          value: formatBTC(btc),
        },
        timestamp: {
          description: '⚡ Satoshis',
          value: formatSATS(sat),
        },
        txCount: {
          description: '🇺🇸 Dollars',
          value: formatUSD(usd),
        },
        size: {
          description: '🇧🇷 Reais',
          value: formatBRL(brl),
        },
      },
    }
  }
}
