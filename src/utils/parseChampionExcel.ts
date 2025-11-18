export interface Operator {
  name: string
  championCount: number
  titles: string[]
}

export async function loadChampions(): Promise<Operator[]> {
  const base = import.meta.env.BASE_URL || '/'
  const url = `${base}excel/champions.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}