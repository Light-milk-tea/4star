import fs from 'node:fs'
import path from 'node:path'
import xlsx from 'xlsx'

const projectRoot = process.cwd()
const excelPath = path.resolve(projectRoot, '网页配置文件/excel/四星队名单.xlsx')
const outputDir = path.resolve(projectRoot, 'public/excel')
const outputPath = path.join(outputDir, 'operators.json')

const KNOWN_CLASSES = new Set(['先锋', '近卫', '重装', '狙击', '术师', '医师', '辅助', '特种'])

function detectRarityFromSheetName(name) {
  if (!name) return 4
  const m = String(name).match(/([1-4])\s*星/)
  if (m) return Number(m[1])
  // 兜底：根据中文数字
  if (/一/.test(name)) return 1
  if (/二/.test(name)) return 2
  if (/三/.test(name)) return 3
  if (/四/.test(name)) return 4
  // 默认按四星队
  return 4
}

function normalizeCell(v) {
  if (v == null) return ''
  return String(v).trim()
}

function detectColumns(headerRow) {
  const cols = { nameIdx: -1, classIdx: -1 }
  const header = headerRow.map(normalizeCell)
  header.forEach((h, i) => {
    if (cols.nameIdx === -1 && /(姓名|干员|名称|名字|Name)/i.test(h)) cols.nameIdx = i
    if (cols.classIdx === -1 && /(职业|类别|定位|Class|职|分支)/i.test(h)) cols.classIdx = i
  })
  return cols
}

function guessClassFromRow(row) {
  for (let i = 1; i < row.length; i++) {
    const val = normalizeCell(row[i])
    if (KNOWN_CLASSES.has(val)) return val
  }
  return ''
}

function parseSheet(ws, sheetName) {
  const rarity = detectRarityFromSheetName(sheetName)
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 })
  const result = []
  if (!rows || rows.length === 0) return result

  // 找到首个非空行作为可能的表头
  let headerIdx = rows.findIndex(r => (r?.length || 0) > 0)
  if (headerIdx < 0) headerIdx = 0
  const header = rows[headerIdx]
  const { nameIdx, classIdx } = detectColumns(header)

  // 数据起始行：如果识别到表头，则从下一行开始
  const start = nameIdx !== -1 ? headerIdx + 1 : headerIdx

  for (let i = start; i < rows.length; i++) {
    const row = rows[i] || []
    // 解析名称
    let name = ''
    if (nameIdx !== -1) {
      name = normalizeCell(row[nameIdx])
    } else {
      name = normalizeCell(row[0])
    }
    if (!name) continue

    // 解析职业
    let clazz = ''
    if (classIdx !== -1) {
      clazz = normalizeCell(row[classIdx])
    } else {
      clazz = guessClassFromRow(row)
    }

    result.push({ name, rarity, class: clazz || '未知' })
  }

  return result
}

function dedupeOperators(list) {
  const map = new Map()
  for (const op of list) {
    if (!map.has(op.name)) {
      map.set(op.name, op)
    } else {
      const prev = map.get(op.name)
      // 如果出现不同星级，优先保留非未知职业的条目，其次保留更高星级（一般不会冲突）
      if ((prev.class === '未知' && op.class !== '未知') || op.rarity > prev.rarity) {
        map.set(op.name, op)
      }
    }
  }
  return Array.from(map.values())
}

async function main() {
  if (!fs.existsSync(excelPath)) {
    console.error(`[错误] 找不到Excel文件: ${excelPath}`)
    process.exit(1)
  }
  const wb = xlsx.readFile(excelPath)
  let all = []
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName]
    const part = parseSheet(ws, sheetName)
    all = all.concat(part)
  }
  // 只保留1~4星
  all = all.filter(op => [1,2,3,4].includes(op.rarity))
  // 去重与排序
  const deduped = dedupeOperators(all)
  deduped.sort((a, b) => a.rarity - b.rarity || a.name.localeCompare(b.name, 'zh-CN'))

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(deduped, null, 2), 'utf-8')
  console.log(`[完成] 已生成 ${outputPath}，共 ${deduped.length} 条干员数据`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})