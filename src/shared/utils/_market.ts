export function calculateSupply(height) {
  if (height >= 33 * 210000) {
    return 20999999.9769
  } else {
    let reward = 50e8
    let supply = 0
    let y = 210000 // reward changes all y blocks
    while (height > y - 1) {
      supply = supply + y * reward
      reward = Math.floor(reward / 2.0)
      height = height - y
    }
    supply = supply + height * reward
    return (supply + reward) / 1e8
  }
}
