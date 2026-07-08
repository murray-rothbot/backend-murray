import { Injectable } from '@nestjs/common'
import { formatNumber, formatSatsBtc } from '../../shared/utils'
import { MessageResponseDto } from '../../shared/dtos'
import Murray from 'murray-js'

@Injectable()
export class LightningService {
  _murray = new Murray()
  constructor() {}

  async getStatistics(): Promise<MessageResponseDto> {
    const { data } = await this._murray.lightning.getStatistics()

    const {
      node_count,
      clearnet_nodes,
      tor_nodes,
      channel_count,
      total_capacity,
      avg_capacity,
      avg_fee_rate,
      avg_base_fee_mtokens,
    } = data.latest

    return {
      title: '⚡ Lightning Network - Statistics',
      fields: {
        nodes: {
          description: '🖥️ Total Nodes',
          value: formatNumber(node_count),
        },
        clearNet: {
          description: '🤵‍♂️ Nodes Clearnet',
          value: formatNumber(clearnet_nodes),
        },
        tor: {
          description: '🕵️ Nodes Tor',
          value: formatNumber(tor_nodes),
        },

        avgCapacity: {
          description: '🪫 Avg. Capacity',
          value: formatSatsBtc(avg_capacity),
        },
        totalCapacity: {
          description: '🪫 Total Capacity',
          value: formatSatsBtc(total_capacity),
        },
        channels: {
          description: '🔀 Channels',
          value: formatNumber(channel_count),
        },
        avgFee: {
          description: '💸 Avg. Fee',
          value: `${formatNumber(avg_fee_rate)} ppm`,
        },
        avgBaseFee: {
          description: '💸 Avg. Base Fee',
          value: `${formatNumber(avg_base_fee_mtokens)} msats`,
        },
      },
    }
  }

  async getNode({ pubkey }) {
    const { data: nodeInfo } = await this._murray.lightning.getNodeDetails({ publicKey: pubkey })

    const {
      public_key,
      alias,
      active_channel_count,
      capacity,
      first_seen,
      updated_at,
      iso_code,
      channels,
    } = nodeInfo
    const flag = iso_code ? `:flag_${iso_code.toLowerCase()}:` : ''

    const peers = channels.map((x) => x.node.alias || '').join('\n')
    const capacities = channels.map((x) => formatSatsBtc(x.capacity)).join('\n')
    const fees = channels.map((x) => `${formatNumber(x.fee_rate)} ppm`).join('\n')

    return {
      title: `${flag} ${alias}`,
      fields: {
        pubkey: {
          description: '🔑 Public Key',
          value: {
            id: {
              description: '🔑 Public Key',
              value: public_key,
            },
            url: {
              description: '🔗 Url:',
              value: `https://mempool.space/lightning/node/${public_key}`,
            },
          },
        },

        channels: {
          description: '🔀 Channels',
          value: formatNumber(active_channel_count),
        },
        capacity: { description: '🪫 Capacity', value: `⚡${formatNumber(capacity)}` },
        firstSeen: { description: '👁️ First seen', value: `<t:${first_seen}:R>` },
        updated: { description: '🗓️ Updated', value: `<t:${updated_at}:R>` },

        topChannels: {
          description: 'Top channels by capacity:',
          value: {
            peer: { description: '👥 Peer', value: peers },
            capacity: { description: '🪫 Capacity', value: capacities },
            fee: { description: '💸 Fee', value: fees },
          },
        },
      },
    }
  }

  async getTop(): Promise<MessageResponseDto> {
    const { data: topNodesInfo } = await this._murray.lightning.getTopNodes()

    const medals = ['🥇', '🥈', '🥉']

    const fields = {}

    const groups = [
      {
        key: 'topByCapacity',
        stat: 'capacity',
        description: '_By capacity:_',
        format: formatSatsBtc,
      },
      {
        key: 'topByChannels',
        stat: 'channels',
        description: '_By channels count:_',
        format: (x) => `${formatNumber(x)} channels`,
      },
    ]

    for (const { key, stat, description, format } of groups) {
      const nodes = {}
      for (let i = 0; i < 3; i++) {
        nodes[`node${i}`] = {
          description: `${medals[i]} ${topNodesInfo[key][i]['alias']}`,
          value: format(topNodesInfo[key][i][stat]),
        }

        fields[key] = {
          description,
          value: nodes,
        }
      }
    }

    return {
      title: '⚡ Top Lightning Nodes',
      fields,
    }
  }
}
