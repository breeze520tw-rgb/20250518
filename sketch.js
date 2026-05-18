let capture;

    fill('#ffffff');

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = '#3b82f6';

    circle(
      x + (capture.width - kp.x) * sx,
      y + kp.y * sy,
      14
    );
  }
}

function drawGestureUI(gesture) {

  fill(255);
  noStroke();

  textAlign(CENTER, CENTER);

  textSize(54);
  textStyle(BOLD);

  text(gesture, width / 2, 90);
}

function drawNoHandMessage() {

  fill(255, 120);
  noStroke();

  textAlign(CENTER, CENTER);

  textSize(28);

  text('請把手放進鏡頭內', width / 2, 90);
}

function checkGesture(hand) {

  let k = hand.keypoints;

  let index =
    dist(k[0].x, k[0].y, k[8].x, k[8].y) >
    dist(k[0].x, k[0].y, k[6].x, k[6].y);

  let middle =
    dist(k[0].x, k[0].y, k[12].x, k[12].y) >
    dist(k[0].x, k[0].y, k[10].x, k[10].y);

  let ring =
    dist(k[0].x, k[0].y, k[16].x, k[16].y) >
    dist(k[0].x, k[0].y, k[14].x, k[14].y);

  let pinky =
    dist(k[0].x, k[0].y, k[20].x, k[20].y) >
    dist(k[0].x, k[0].y, k[18].x, k[18].y);

  if (index && middle && ring && pinky) {
    return '✋ PAPER';
  }

  if (index && middle && !ring && !pinky) {
    return '✌️ SCISSORS';
  }

  if (!index && !middle && !ring && !pinky) {
    return '✊ ROCK';
  }

  return '偵測中...';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}