let capture;

function setup() {
  // 建立與視窗同寬高的全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設出現在畫布下方的 video 標籤
  capture.hide();
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  push();
  // 1. 將座標原點移至畫布中心
  translate(width / 2, height / 2);
  // 2. 進行水平翻轉 (左右顛倒)
  scale(-1, 1);
  // 3. 設定影像繪製模式為中心，並縮放至全螢幕的 50%
  imageMode(CENTER);
  image(capture, 0, 0, width * 0.5, height * 0.5);
  pop();
}

function windowResized() {
  // 當瀏覽器視窗大小改變時，同步調整畫布
  resizeCanvas(windowWidth, windowHeight);
}