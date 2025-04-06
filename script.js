const segments = document.querySelectorAll('.segment');
const popup = document.getElementById('popup');
const startButton = document.getElementById('start-button');

let current = 0;

function showSegment(index) {
  segments.forEach((seg, i) => {
    seg.style.display = i === index ? 'flex' : 'none';
    seg.style.opacity = 0;
    seg.style.transform = 'scale(0.95) rotateX(10deg)';
  });

  const seg = segments[index];
  if (!seg) return;

  // Smooth animation in
  let frame = 0;
  function animate() {
    frame++;
    const progress = Math.min(frame / 20, 1);
    seg.style.opacity = progress;
    seg.style.transform = `scale(${0.95 + 0.05 * progress}) rotateX(${10 - 10 * progress}deg)`;
    seg.style.filter = `brightness(${0.6 + 0.4 * progress})`;
    if (progress < 1) requestAnimationFrame(animate);
  }
  animate();
}

function nextSegment() {
  if (current < segments.length) {
    showSegment(current);
    current++;
    setTimeout(nextSegment, 2300); // Delay between segments
  } else {
    showPopup();
  }
}

function showPopup() {
  popup.style.display = 'block';
  popup.style.opacity = 0;
  popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
  
  let frame = 0;
  function animatePopup() {
    frame++;
    const progress = Math.min(frame / 15, 1);
    popup.style.opacity = progress;
    popup.style.transform = `translate(-50%, -50%) scale(${0.95 + 0.05 * progress})`;
    if (progress < 1) requestAnimationFrame(animatePopup);
  }
  animatePopup();
}

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  nextSegment();
});

popup.querySelector('button').addEventListener('click', () => {
  popup.style.display = 'none';
  current = 0;
  startButton.style.display = 'block';
});
