// script.js
function calculate() {
  // Read basic inputs
  const birthdate = document.getElementById('birthdate').value;
  const birthhour = parseInt(document.getElementById('birthhour').value, 10);
  const gender = document.getElementById('gender').value;
  const yearBuild = parseInt(document.getElementById('yearBuild').value, 10);
  const houseDir = document.getElementById('houseDirection').value;

  if (!birthdate || isNaN(birthhour) || isNaN(yearBuild) || !houseDir) {
    alert('Vui lòng nhập đầy đủ Ngày sinh, Giờ sinh, Năm xây nhà và Hướng nhà.');
    return;
  }

  // Calculate Can Chi & Element
  const by = new Date(birthdate).getFullYear();
  const stems = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const branches = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  const stem = stems[(by - 4) % 10];
  const branch = branches[(by - 4) % 12];
  const canChi = stem + ' ' + branch;
  let element;
  if (['Giáp','Ất'].includes(stem)) element = 'Mộc';
  else if (['Bính','Đinh'].includes(stem)) element = 'Hỏa';
  else if (['Mậu','Kỷ'].includes(stem)) element = 'Thổ';
  else if (['Canh','Tân'].includes(stem)) element = 'Kim';
  else element = 'Thủy';

  // Calculate Kua (Mệnh quái)
  let lastTwo = by % 100;
  let sum = Math.floor(lastTwo / 10) + (lastTwo % 10);
  if (sum > 9) sum = Math.floor(sum / 10) + (sum % 10);
  let K = by < 2000
    ? (gender === 'nam' ? 10 - sum : 5 + sum)
    : (gender === 'nam' ? 9 - sum : 6 + sum);
  if (K > 9) K = Math.floor(K / 10) + (K % 10);
  const kuaMap = {1:'Khảm',2:'Khôn',3:'Chấn',4:'Tốn',6:'Càn',7:'Đoài',8:'Cấn',9:'Ly'};
  const kua = K === 5 ? (gender === 'nam' ? 'Khôn' : 'Cấn') : kuaMap[K];
  const quaiMenh = kua + ' Mệnh';

  // Age for house
  const age = yearBuild - by + 1;

  // Check Kim Lâu, Tam Tai, Hoang Oc
  const kimLau = [1,3,6,8].includes(age % 9);
  const tamTaiGroups = { 'Thân':['Thân','Tý','Thìn'], 'Tỵ':['Tỵ','Dậu','Sửu'], 'Hợi':['Hợi','Mão','Mùi'], 'Dần':['Dần','Ngọ','Tuất'] };
  let tamTai = Object.values(tamTaiGroups).some(arr => arr.includes(branch));
  const hoangSets = [['Cấn','Đoài','Càn','Khảm'], ['Ly','Khôn','Chấn','Tốn'], ['Cấn','Khảm','Ly','Khôn'], ['Đoài','Chấn','Tốn','Cấn']];
  const hoangOc = hoangSets.some(set => set.includes(kua));

  // Read form elements
  const slope = document.getElementById('slope').checked;
  const slopeDir = document.getElementById('slopeDir').value;
  const road = document.getElementById('road').checked;
  const roadDir = document.getElementById('roadDir').value;
  const waterDistance = parseFloat(document.getElementById('waterDistance').value) || Infinity;
  const hospital = document.getElementById('hospital').checked;
  const temple = document.getElementById('temple').checked;
  const church = document.getElementById('church').checked;
  const cemetery = document.getElementById('cemetery').checked;

  // Determine bad factors
  const badFactors = [];
  if (slope) badFactors.push('Đất dốc');
  if (slope && slopeDir) badFactors.push('Hướng dốc: ' + slopeDir);
  if (road) badFactors.push('Đường đâm thẳng vào cửa');
  if (road && roadDir) badFactors.push('Hướng đường: ' + roadDir);
  if (!isNaN(waterDistance) && waterDistance < 10) badFactors.push('Gần mặt nước: ' + waterDistance + 'm');
  if (hospital) badFactors.push('Gần bệnh viện');
  if (temple) badFactors.push('Gần chùa/miếu');
  if (church) badFactors.push('Gần nhà thờ');
  if (cemetery) badFactors.push('Gần nghĩa địa');

  // Scoring
  let score = 100;
  if (kimLau) score -= 15;
  if (tamTai) score -= 10;
  if (hoangOc) score -= 15;
  score -= badFactors.length * 5;
  const goodDirs = { 'Kim':['Tây','Tây Bắc','Đông Bắc'], 'Mộc':['Đông','Đông Nam'], 'Thủy':['Bắc','Đông Nam'], 'Hỏa':['Nam'], 'Thổ':['Tây Nam','Đông Bắc'] };
  if (goodDirs[element]?.includes(houseDir)) score += 10;

  // Render result
  const resultBox = document.getElementById('result');
  const scoreBox = document.getElementById('score');
  let html = '<h2>Kết quả tra cứu phong thủy</h2>';
  html += `<p><b>Can Chi:</b> ${canChi}</p><p><b>Ngũ hành:</b> ${element}</p><p><b>Quái mệnh:</b> ${quaiMenh}</p>`;
  html += `<p><b>Tuổi xây nhà:</b> ${age} `
       + `(${kimLau? 'Phạm Kim Lâu':'OK Kim Lâu'}, `
       + `${hoangOc? 'Phạm Hoang Ốc':'OK Hoang Ốc'}, `
       + `${tamTai? 'Phạm Tam Tai':'OK Tam Tai'})</p>`;
  html += '<h3>Yếu tố xấu đã chọn:</h3><ul>';
  badFactors.forEach(f => { html += '<li>' + f + '</li>'; });
  html += '</ul>';
  resultBox.innerHTML = html;

  const evalText = score >= 90 ? 'Rất tốt' : score >= 75 ? 'Tốt' : score >= 60 ? 'Trung bình' : score >= 40 ? 'Yếu' : 'Rất xấu';
  scoreBox.innerHTML = `<h2>Điểm phong thủy: ${score}</h2><p>${evalText}</p>`;
}
