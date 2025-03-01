export async function getSeed() {
  const res = await fetch('/api/orbitport')
  const { seed } = await res.json()
  return seed
}

export async function getPersonality(loneliness: number, seed: number) {
  const res = await fetch(`/api/lmm?loneliness=${loneliness}&seed=${seed}`)
  const { personality } = await res.json()
  return personality
}

export async function getImage(seed: number) {
  const res = await fetch(`/api/replicate?seed=${seed}`)
  const image = await res.blob()
  return image
}