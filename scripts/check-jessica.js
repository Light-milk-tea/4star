import XLSX from 'xlsx';

const workbook = XLSX.readFile('c:/Front_End/4star/网页配置文件/excel/四星队名单.xlsx');
const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

console.log('检查杰西卡出现在哪些列:');
data.forEach((row, index) => {
  Object.keys(row).forEach(col => {
    if (row[col] === '杰西卡') {
      const rarity = col.includes('一星') ? 1 : col.includes('二星') ? 2 : col.includes('三星') ? 3 : col.includes('四星') ? 4 : '未知';
      console.log(`第${index + 1}行, 列名: ${col}, 星级: ${rarity}`);
    }
  });
});

// 检查是否有重复的杰西卡
const jessicaCount = {};
data.forEach((row, index) => {
  Object.keys(row).forEach(col => {
    if (row[col] === '杰西卡') {
      const rarity = col.includes('一星') ? 1 : col.includes('二星') ? 2 : col.includes('三星') ? 3 : col.includes('四星') ? 4 : '未知';
      if (!jessicaCount[rarity]) jessicaCount[rarity] = 0;
      jessicaCount[rarity]++;
    }
  });
});

console.log('\n杰西卡统计:');
Object.keys(jessicaCount).forEach(rarity => {
  console.log(`${rarity}星: ${jessicaCount[rarity]}个`);
});