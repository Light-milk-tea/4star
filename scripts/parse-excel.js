import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// 读取Excel文件
const workbook = XLSX.readFile('c:/Front_End/4star/网页配置文件/excel/四星队名单.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('原始Excel数据:');
console.log(JSON.stringify(data, null, 2));

// 提取所有星级的干员
const operators = [];

// 四星干员职业映射表
const operatorClassMap = {
  '冬时': '先锋', '豆苗': '先锋', '桃金娘': '先锋', '红豆': '先锋', '清道夫': '先锋', 
  '讯使': '先锋', '骋风': '先锋', '休谟斯': '先锋', '石英': '先锋', '跃跃': '先锋',
  '铅踝': '狙击', '松果': '狙击', '酸糖': '狙击', '安比尔': '狙击', '梅': '狙击', 
  '红云': '狙击', '白雪': '狙击', '流星': '狙击', '杰西卡': '狙击', '云迹': '先锋',
  '泡泡': '重装', '坚雷': '重装', '古米': '重装', '蛇屠箱': '重装', '角峰': '重装', 
  '露托': '重装', '褐果': '医师', '清流': '医师', '苏苏洛': '医师', '调香师': '医师', 
  '嘉维尔': '医师', '末药': '医师', '罗比菈塔': '辅助', '波登可': '辅助', '地灵': '辅助', 
  '深海色': '辅助', '协律': '辅助', '深靛': '术师', '卡达': '术师', '袼雷伊': '术师', 
  '远山': '术师', '夜烟': '术师', '维荻': '辅助', '孑': '特种', '伊桑': '特种', 
  '阿消': '特种', '暗索': '特种', '砾': '特种', '艾丝黛尔': '近卫', '芳汀': '近卫', 
  '断罪者': '近卫', '宴': '近卫', '猎蜂': '近卫', '慕斯': '近卫', '霜叶': '近卫', 
  '缠丸': '近卫', '杜宾': '近卫', '刻刀': '近卫', '杰克': '近卫'
};

// 处理每一行数据
data.forEach(row => {
  // 1星干员
  if (row['一星干员']) {
    operators.push({
      name: row['一星干员'],
      rarity: 1,
      class: '未知'
    });
  }
  
  // 2星干员
  if (row['二星干员']) {
    operators.push({
      name: row['二星干员'],
      rarity: 2,
      class: '未知'
    });
  }
  
  // 3星干员
  if (row['三星干员']) {
    operators.push({
      name: row['三星干员'],
      rarity: 3,
      class: '未知'
    });
  }
  
  // 4星干员
  if (row['四星干员']) {
    operators.push({
      name: row['四星干员'],
      rarity: 4,
      class: operatorClassMap[row['四星干员']] || '未知'
    });
  }
});

console.log('\n提取的干员数据:');
console.log(JSON.stringify(operators, null, 2));

// 按星级统计
const stats = {};
operators.forEach(op => {
  if (!stats[op.rarity]) stats[op.rarity] = 0;
  stats[op.rarity]++;
});

console.log('\n各星级干员数量:');
Object.keys(stats).sort().forEach(rarity => {
  console.log(`${rarity}星: ${stats[rarity]}个`);
});

// 保存到文件
const outputPath = 'c:/Front_End/4star/public/excel/operators.json';
fs.writeFileSync(outputPath, JSON.stringify(operators, null, 2));
console.log(`\n数据已保存到: ${outputPath}`);