export interface Operator {
  name: string
  championCount: number
  titles?: string[]
}

// 异步加载冠军数据（已按冠军数降序）
export async function loadChampions(): Promise<Operator[]> {
  const res = await fetch('/excel/champions.json')
  if (!res.ok) throw new Error('加载 champions.json 失败')
  return res.json() as Promise<Operator[]>
}