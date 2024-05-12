import { Injectable } from '@nestjs/common'

import Murray from 'murray-js'

import { MessageResponseDto } from '../../shared/dtos'

import { formatNumber, formatSATS, formatSatsBtc } from 'src/shared/utils'

@Injectable()
export class BlockchainService {
  _murray = new Murray()

  constructor() {}

  async getAddress({ address }): Promise<MessageResponseDto> {
    const { data } = await this._murray.blockchain.getAddressDetails({ address })

    return {
      title: '',
      description: '',
      fields: {
        address: {
          description: '🪧 Address',
          value: {
            id: {
              description: '🪧 Address ID',
              value: data.address,
            },
            url: {
              description: '🔗 Url:',
              value: `https://mempool.space/address/${data.address}`,
            },
          },
        },
        onchain: {
          description: 'On chain transactions:',
          value: {
            received: {
              description: `📥 Received: ${data.chain_stats.funded_txo_count} txs`,
              value: `Total: ${formatSatsBtc(data.chain_stats.funded_txo_sum)}`,
            },
            sent: {
              description: `📤 Sent: ${data.chain_stats.spent_txo_count} txs`,
              value: `Total: ${formatSatsBtc(data.chain_stats.spent_txo_sum)}`,
            },
          },
        },
        mempool: {
          description: 'Mempool transactions:',
          value: {
            received: {
              description: `📥 Received: ${data.mempool_stats.funded_txo_count} txs`,
              value: `Total: ${formatSatsBtc(data.mempool_stats.funded_txo_sum)}`,
            },
            sent: {
              description: `📤 Sent: ${data.mempool_stats.spent_txo_count} txs`,
              value: `Total: ${formatSatsBtc(data.mempool_stats.spent_txo_sum)}`,
            },
          },
        },
      },
    }
  }

  async getBlock({ hash, height }): Promise<any> {
    const { data } = await this._murray.blockchain.getBlock({ hash, height })

    return {
      title: '',
      description: '',
      fields: {
        height: {
          description: '🔗 Height',
          value: `${formatNumber(data.height)}`,
        },
        timestamp: {
          description: '🗓️ TimeStamp',
          value: `<t:${data.timestamp}:R>`,
        },
        txCount: {
          description: '🔀 Transaction count',
          value: formatNumber(data.tx_count),
        },
        size: {
          description: '📏 Size',
          value: `${formatNumber(data.size / 1e6)} MB`,
        },
        weight: {
          description: '⚖️ Weight',
          value: `${formatNumber(data.weight / 1e6)} MWU`,
        },
        difficulty: {
          description: '🦾 Difficulty',
          value: formatNumber(data.difficulty),
        },
        hash: {
          description: '🧬 Hash',
          value: {
            id: {
              description: '🧬 Hash ID',
              value: data.id,
            },
            url: {
              description: '🔗 Url:',
              value: `https://mempool.space/block/${data.id}`,
            },
          },
        },
        merkleRoot: {
          description: '🌱 Merkle root',
          value: `${data.merkle_root}`,
        },
      },
    }
  }

  async getHalving(): Promise<any> {
    const { data } = await this._murray.blockchain.getBlock()
    const { height } = data

    const BLOCKS_PER_ERA = 210000
    const AVERAGE_BLOCK_TIME_MINUTES = 10
    const MINUTES_PER_DAY = 1440

    // Find the start of the next era
    const nextEra = Math.floor(height / BLOCKS_PER_ERA) + 1
    const nextHalvingBlock = nextEra * BLOCKS_PER_ERA

    // Calculate how many blocks and how much time until the next halving
    const blocksUntilHalving = nextHalvingBlock - height
    const minutesUntilHalving = blocksUntilHalving * AVERAGE_BLOCK_TIME_MINUTES
    const daysUntilHalving = minutesUntilHalving / MINUTES_PER_DAY

    // Calculate the future date
    const currentDate = new Date()
    const nextHalvingDate = new Date(currentDate.getTime() + daysUntilHalving * 24 * 60 * 60 * 1000)

    // Find the starting block of the current era
    const currentEra = Math.floor(height / BLOCKS_PER_ERA)
    const currentEraStartingBlock = currentEra * BLOCKS_PER_ERA

    // Calculate blocks mined in the current era
    const blocksMined = height - currentEraStartingBlock

    // Calculate the completed percentage in the current era
    const completedPercentage = (blocksMined / BLOCKS_PER_ERA) * 100

    return {
      title: '🎉 Bitcoin Halving Countdown',
      description:
        'The halving is an event that occurs approximately every four years and reduces the rate in which new bitcoin is created by 50%.',
      fields: {
        height: {
          description: '🔗 Current Block',
          value: `${formatNumber(height)}`,
        },
        halvingEra: {
          description: '📅 Next Halving Era',
          value: nextEra,
        },
        halvingCountdown: {
          description: '⏳ Countdown',
          value: `${formatNumber(blocksUntilHalving)} Blocks`,
        },
        daysUntilHalving: {
          description: '⏳ Days Until Halving',
          value: `${formatNumber(daysUntilHalving)} days`,
        },
        nextHalvingBlock: {
          description: '🔗 Next Halving Block',
          value: `${formatNumber(nextHalvingBlock)}`,
        },
        nextHalvingDate: {
          description: '🗓️ Halving Date',
          value: `${nextHalvingDate}`,
        },
        completedPercentage: {
          description: '🎉 Completed Percentage',
          value: `${formatNumber(completedPercentage)}%`,
        },
        completedPercentageRaw: {
          description: '🎉 Completed Percentage raw',
          value: completedPercentage,
        },
      },
    }
  }

  async getDifficulty(): Promise<any> {
    const { data } = await this._murray.blockchain.getHashrate()

    const {
      remainingBlocks,
      progressPercent,
      estimatedRetargetDate,
      difficultyChange,
      previousRetarget,
    } = data

    return {
      title: '🦾 Next Difficulty Adjustment',
      description:
        'In order to ensure bitcoin blocks are discovered roughly every 10 minutes, an automatic system is in place to adjust the difficulty every 2016 blocks depending on how many miners are competing to discover blocks at any given time.',
      fields: {
        currentProgress: {
          description: `🏁 Current Progress: ${2016 - remainingBlocks} of 2016 blocks`,
          value: progressPercent,
        },
        estimatedDate: {
          description: '🗓️ Estimated Date',
          value: estimatedRetargetDate,
        },
        estimateChange: {
          description: 'Estimated Change',
          value: `${difficultyChange > 0 ? '🔼' : '🔽'} ${difficultyChange.toFixed(2)}%`,
        },
        previousChange: {
          description: 'Previous Change',
          value: `${previousRetarget > 0 ? '🔼' : '🔽'} ${previousRetarget.toFixed(2)}%`,
        },
      },
    }
  }

  async getFeesRecommended(): Promise<any> {
    const { data } = await this._murray.blockchain.getFeesRecommended()

    const { fastestFee, halfHourFee, hourFee, economyFee, minimumFee } = data

    const vByte = (value: number) => `${value} sats/vByte`

    const response = {
      title: '💸 Network Fees',
      description: '',
      fields: {
        fastestFee: {
          description: `🐇 Fast`,
          value: vByte(fastestFee),
        },
        halfHourFee: {
          description: '🐢 1/2 hour',
          value: vByte(halfHourFee),
        },
        hourFee: {
          description: '🦥 1 hour',
          value: vByte(hourFee),
        },
        economy: {
          description: '🪙 Economy',
          value: vByte(economyFee),
        },
        minimum: {
          description: '🔻 Minimum',
          value: vByte(minimumFee),
        },
      },
    }

    if (fastestFee === 1) {
      response.fields['tip'] = {
        description: 'Great moment to:',
        value: '* Do a coinjoin\n* Consolidate your UTXOs\n* Open a Lightning Channel',
      }
    }
    return response
  }

  async getTransaction({ transaction }): Promise<MessageResponseDto> {
    const { data } = await this._murray.blockchain.getTransaction({ txid: transaction })

    const {
      txid,
      vin,
      vout,
      size,
      weight,
      status: { confirmed },
    } = data

    const vin_total = vin.reduce(
      (total: any, num: { prevout: { value: any } }) => total + num.prevout?.value,
      0,
    )
    const vout_total = vout.reduce((total: any, num: { value: any }) => total + num?.value, 0)
    const fees = vin_total - vout_total
    const rbf = vin.some((v: { sequence: number }) => v.sequence < 0xfffffffe)

    return {
      title: '🔀 Transaction',
      description: '',
      fields: {
        hash: {
          description: '🧬 Hash:',
          value: {
            id: {
              description: '🧬 Hash',
              value: txid,
            },
            url: {
              description: '🔗 Url:',
              value: `https://mempool.space/tx/${txid}`,
            },
          },
        },
        inputs: {
          description: `📥 Inputs: ${vin.length ? vin.length : 0} txs`,
          value: `${vin_total ? formatSatsBtc(vin_total) : formatSatsBtc(0)}`,
        },
        outputs: {
          description: `📤 Outputs: ${vout.length} txs`,
          value: `${formatSatsBtc(vout_total)}`,
        },
        fees: {
          description: '💸 Fees:',
          value: `${fees ? formatSATS(fees) : formatSATS(0)}`,
        },
        size: {
          description: '📏 Size:',
          value: `${formatNumber(size)} Bytes`,
        },
        weight: {
          description: '⚖️ Weight:',
          value: `${formatNumber(weight)} WU`,
        },
        confirmed: {
          description: '✅ Confirmed?',
          value: `${confirmed}`,
        },
        rbf: {
          description: 'RBF?',
          value: rbf,
        },
      },
    }
  }
}
