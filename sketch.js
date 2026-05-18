let capture;
let handPose;
let hands = [];

// 定義手部點位之間的連線關係
const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], // 拇指
  [0, 5], [5, 6], [6, 7], [7, 8], // 食指
  [0, 9], [9, 10], [10, 11], [11, 12], // 中指
  [0, 13], [13, 14], [14, 15], [15, 16], // 無名指
  [0, 17], [17, 18], [18, 19], [19, 20], // 小指
  [5, 9], [9, 13], [13, 17] // 掌心部分
];

function preload() {
  // 初始化手部辨識模型，開啟 flipped 以符合鏡像
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機並設定水平翻轉
  capture = createCapture(VIDEO, { flipped: true });
  capture.hide();

  // 開始偵測手部
  handPose.detectStart(capture, gotHands);
}

function draw() {
  background('#e7c6ff');

  if (capture.loadedmetadata) {
    // 計算顯示影像的縮放與位置 (置中，50% 大小)
    let targetW = width * 0.5;
    let targetH = height * 0.5;
    let offsetX = (width - targetW) / 2;
    let offsetY = (height - targetH) / 2;

    // 繪製鏡像影像
    image(capture, offsetX, offsetY, targetW, targetH);

    // 如果有偵測到手部
    if (hands.length > 0) {
      for (let hand of hands) {
        if (hand.confidence > 0.1) {
          drawSkeleton(hand, offsetX, offsetY, targetW, targetH);
          
          // 偵測並顯示手勢文字
          let gesture = checkGesture(hand);
          if (gesture !== "") {
            fill(0);
            noStroke();
            textSize(width * 0.03);
            textAlign(CENTER, BOTTOM);
            text(gesture, width / 2, offsetY - 10);
          }
        }
      }
    }
  }
}

function drawSkeleton(hand, ox, oy, tw, th) {
  let k = hand.keypoints;
  // 計算座標轉換係數
  let sx = tw / capture.width;
  let sy = th / capture.height;

  // 繪製骨架連線
  stroke(255, 255, 0); // 黃色連線
  strokeWeight(3);
  for (let pair of connections) {
    let p1 = k[pair[0]];
    let p2 = k[pair[1]];
    line(ox + p1.x * sx, oy + p1.y * sy, ox + p2.x * sx, oy + p2.y * sy);
  }

  // 繪製指關節點
  noStroke();
  fill(255, 0, 0); // 紅色關節
  for (let kp of k) {
    circle(ox + kp.x * sx, oy + kp.y * sy, 8);
  }
}

function checkGesture(hand) {
  let k = hand.keypoints;
  // 判定手指是否伸直：指尖(8,12,16,20)到手腕(0)的距離是否大於中間關節(6,10,14,18)到手腕的距離
  let index = dist(k[0].x, k[0].y, k[8].x, k[8].y) > dist(k[0].x, k[0].y, k[6].x, k[6].y);
  let middle = dist(k[0].x, k[0].y, k[12].x, k[12].y) > dist(k[0].x, k[0].y, k[10].x, k[10].y);
  let ring = dist(k[0].x, k[0].y, k[16].x, k[16].y) > dist(k[0].x, k[0].y, k[14].x, k[14].y);
  let pinky = dist(k[0].x, k[0].y, k[20].x, k[20].y) > dist(k[0].x, k[0].y, k[18].x, k[18].y);

  if (index && middle && ring && pinky) return "布 (PAPER)";
  if (index && middle && !ring && !pinky) return "剪刀 (SCISSORS)";
  if (!index && !middle && !ring && !pinky) return "石頭 (ROCK)";
  return "";
}

function windowResized() {
  // 當瀏覽器視窗大小改變時，同步調整畫布
  resizeCanvas(windowWidth, windowHeight);
}