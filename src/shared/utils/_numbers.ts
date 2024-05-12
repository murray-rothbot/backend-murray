export function kFormatter(num: number, pFormatter?: Function): string {
  const unity = ['', 'k', 'M', 'B', 'T']
  const digits = Math.floor(Math.log10(Math.abs(num)))
  const reduce_factor = Math.floor(digits / 3)
  const value = Math.abs(num) / 10 ** (reduce_factor * 3)
  const formatted = (pFormatter || formatNumber)(value, 1, 1)

  return `${num < 0 ? '-' : ''}${formatted}${unity[reduce_factor]}`
}

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'kb', 'mb', 'gb', 'tb']
  if (bytes == 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `**${(bytes / Math.pow(1024, i)).toFixed(2)}** ${sizes[i]}`
}

export const formatNumber = (
  number: number,
  maximumFractionDigits = 0,
  minimumFractionDigits = 0,
) =>
  `${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number)}`

export const formatUSD = (number: number) =>
  `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)}`

export const formatBRL = (number: number) =>
  `${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)}`

export const formatSatsBtc = (number: number) => {
  if (number >= 1e9) return formatBTC(number / 1e8)
  return formatSATS(number)
}

export const formatBTC = (number: number) =>
  `${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: number >= 1000 ? 0 : 2,
    maximumFractionDigits: number >= 1000 ? 0 : 2,
  }).format(number)} BTC`

export const formatSATS = (number: number) =>
  `${new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(number)} sats`
