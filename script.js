/**
 * Chúc Mừng 20/10 - Ngày Phụ Nữ Việt Nam
 * Script xử lý hiệu ứng cánh hoa rơi, mở thư 3D, bốc thăm lời chúc, âm nhạc hộp nhạc & cá nhân hóa
 */

document.addEventListener('DOMContentLoaded', () => {
  initURLParams();
  initPetalAnimation();
  initConfettiAnimation();
  initEnvelopeInteraction();
  initSurpriseWishes();
  initMusicBox();
  initPersonalizeForm();
});

/* ==================== 1. ĐỌC THAM SỐ TỪ URL (CÁ NHÂN HÓA QUA LINK) ==================== */
function initURLParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Hỗ trợ các từ khóa: to, name, receiver, ten, nguoinhan
  const toName = params.get('to') || params.get('name') || params.get('receiver') || params.get('ten') || params.get('nguoinhan');
  // Hỗ trợ các từ khóa: from, sender, gui, nguoigui
  const fromName = params.get('from') || params.get('sender') || params.get('gui') || params.get('nguoigui');

  if (toName) {
    const cleanTo = decodeURIComponent(toName).trim();
    updateRecipient(cleanTo);
    document.title = `Chúc Mừng 20/10 - Dành Tặng ${cleanTo} 🌸`;
  }

  if (fromName) {
    const cleanFrom = decodeURIComponent(fromName).trim();
    updateSender(cleanFrom);
  }
}

function updateRecipient(name) {
  if (!name.trim()) return;
  document.getElementById('displayRecipient').textContent = name;
  document.getElementById('letterRecipient').textContent = name;
}

function updateSender(name) {
  if (!name.trim()) return;
  document.getElementById('letterSender').textContent = name;
}

/* ==================== 2. HIỆU ỨNG CÁNH HOA & TRÁI TIM BAY (CANVAS) ==================== */
function initPetalAnimation() {
  const canvas = document.getElementById('petalCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = Math.min(35, Math.floor(width / 35));
  const petals = [];

  const petalColors = ['#ffccd5', '#ffb3c1', '#ff8fa3', '#ff4d6d', '#ffd1dc'];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 9 + 8;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1 - 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.02;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.opacity = Math.random() * 0.5 + 0.4;
      this.type = Math.random() > 0.3 ? 'petal' : 'heart';
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 1.2 + this.speedX;
      this.angle += this.angularSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        // Vẽ cánh hoa mềm mại
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size * 1.4);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
      } else {
        // Vẽ trái tim nhỏ lơ lửng
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
        ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < petalsCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==================== 3. HIỆU ỨNG PHÁO HOA CONFETTI ==================== */
let triggerConfettiBurst = () => {};

function initConfettiAnimation() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let particles = [];
  const colors = ['#ff0054', '#ff5400', '#ffbd00', '#9b5de5', '#00f5d4', '#f15bb5', '#ffffff'];

  class ConfettiParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = Math.random() * 8 + 4;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 12 + 4;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - 3;
      this.gravity = 0.25;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.life = 100;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.rotation += this.rotationSpeed;
      this.life -= 1.3;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.life / 100);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  triggerConfettiBurst = (x = width / 2, y = height / 2, count = 70) => {
    for (let i = 0; i < count; i++) {
      particles.push(new ConfettiParticle(x, y));
    }
  };

  function renderConfetti() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(renderConfetti);
  }

  renderConfetti();
}

/* ==================== 4. TƯƠNG TÁC MỞ PHONG BÌ THƯ 3D ==================== */
function initEnvelopeInteraction() {
  const envelopeBox = document.getElementById('envelopeBox');
  const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
  const openBtnText = document.getElementById('openBtnText');

  let isOpen = false;

  function toggleEnvelope() {
    isOpen = !isOpen;
    if (isOpen) {
      envelopeBox.classList.add('open');
      openBtnText.textContent = 'Gấp thư lại';
      // Bắn pháo hoa rực rỡ khi mở thư
      const rect = envelopeBox.getBoundingClientRect();
      triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 80);
    } else {
      envelopeBox.classList.remove('open');
      openBtnText.textContent = 'Bấm để mở phong bì thư';
    }
  }

  envelopeBox.addEventListener('click', toggleEnvelope);
  openEnvelopeBtn.addEventListener('click', toggleEnvelope);
}

/* ==================== 5. HỘP BỐC THĂM LỜI CHÚC NGẪU NHIÊN ==================== */
const WISH_LIST = [
  "Chúc bạn ngày 20/10 ngập tràn niềm vui, nhan sắc thăng hạng, tiền tài rực rỡ và luôn tươi cười rạng rỡ như đóa hồng!",
  "20/10 chúc bạn thân của tôi: Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cà phê phin, luôn vui vẻ yêu đời và sớm có người yêu chiều chuộng!",
  "Chúc bạn một ngày 20/10 thật nhiều hoa, nhiều quà, công việc nhẹ nhàng, KPI luôn vượt và lúc nào cũng là cô gái hạnh phúc nhất!",
  "Gửi bạn ngàn lời chúc tốt đẹp nhất: Mong bạn mỗi ngày đều được là chính mình, an yên tự tại, luôn rạng rỡ và tỏa sáng lấp lánh!",
  "Chúc bạn thân yêu ngày 20/10 nhận được cơn mưa quà tặng, bão lời chúc và luôn được trân trọng, nâng niu như báu vật!",
  "Chúc bạn tuổi mới thêm rạng ngời, ăn gì cũng không mập, shopping không cần nhìn giá và luôn có nụ cười tỏa nắng trên môi!",
  "20/10 tuyệt vời nhé cô gái! Hãy luôn nhớ rằng: Bạn là duy nhất, xinh đẹp và xứng đáng với những điều ngọt ngào nhất trên thế giới này!",
  "Chúc người bạn tuyệt vời của tôi ngày 20/10 thật chill, vui vẻ bên những người thân yêu và đạt được mọi dự định trong cuộc sống!"
];

let lastWishIndex = -1;

function initSurpriseWishes() {
  const btnRandomWish = document.getElementById('btnRandomWish');
  const btnCopyWish = document.getElementById('btnCopyWish');
  const randomWishText = document.getElementById('randomWishText');
  if (!btnRandomWish || !btnCopyWish || !randomWishText) return;

  function getNewWish() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * WISH_LIST.length);
    } while (newIndex === lastWishIndex && WISH_LIST.length > 1);
    
    lastWishIndex = newIndex;
    const wish = WISH_LIST[newIndex];

    randomWishText.style.opacity = '0';
    randomWishText.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      randomWishText.textContent = wish;
      randomWishText.style.transition = 'all 0.3s ease';
      randomWishText.style.opacity = '1';
      randomWishText.style.transform = 'translateY(0)';
    }, 150);

    const btnRect = btnRandomWish.getBoundingClientRect();
    triggerConfettiBurst(btnRect.left + btnRect.width / 2, btnRect.top, 35);
  }

  btnRandomWish.addEventListener('click', getNewWish);

  btnCopyWish.addEventListener('click', () => {
    const text = randomWishText.textContent;
    copyToClipboard(text);
  });
}

/* ==================== 6. ÂM NHẠC HỘP NHẠC (MUSIC BOX WEB AUDIO API) ==================== */
function initMusicBox() {
  const toggleBtn = document.getElementById('musicToggleBtn');
  const soundWave = document.getElementById('soundWave');
  const musicLabel = toggleBtn.querySelector('.music-label');

  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;

  // Giai điệu nhẹ nhàng hộp nhạc (Hạ âm Pentatonic C/G/A/D du dương)
  const notes = [
    261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
    440.00, 523.25, 659.25, 783.99, // A4, C5, E5, G5
    392.00, 493.88, 587.33, 659.25, // G4, B4, D5, E5
    349.23, 440.00, 523.25, 659.25  // F4, A4, C5, E5
  ];

  let noteIndex = 0;

  function playNote(freq) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine'; // Âm sắc chuông / hộp nhạc êm dịu
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.3);
    } catch (e) {
      console.warn("Audio note error:", e);
    }
  }

  function startMusicLoop() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      const freq = notes[noteIndex % notes.length];
      playNote(freq);
      // Điểm xuyết thêm nốt bổng
      if (noteIndex % 4 === 0) {
        setTimeout(() => playNote(notes[(noteIndex + 3) % notes.length] * 1.5), 250);
      }
      noteIndex++;
    }, 450);
  }

  function stopMusic() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    soundWave.classList.remove('playing');
    musicLabel.textContent = 'Bật nhạc 🎵';
    isPlaying = false;
  }

  function startMusic() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    soundWave.classList.add('playing');
    musicLabel.textContent = 'Tắt nhạc ⏸';
    isPlaying = true;
    startMusicLoop();
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

/* ==================== 7. FORM TÙY BIẾN THIỆP ==================== */
function initPersonalizeForm() {
  const applyBtn = document.getElementById('applyPersonalizeBtn');
  if (!applyBtn) return;
  const inputRecipient = document.getElementById('inputRecipient');
  const inputSender = document.getElementById('inputSender');

  applyBtn.addEventListener('click', () => {
    const to = inputRecipient.value.trim();
    const from = inputSender.value.trim();

    if (to) updateRecipient(to);
    if (from) updateSender(from);

    // Cập nhật URLSearchParams để người dùng có thể copy đường link
    const newUrl = new URL(window.location);
    if (to) newUrl.searchParams.set('to', to);
    if (from) newUrl.searchParams.set('from', from);
    window.history.replaceState({}, '', newUrl);

    showToast('✨ Đã cập nhật thiệp với tên của bạn thành công!');
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 60);
  });
}

/* ==================== 8. TIỆN ÍCH COPY & TOAST ==================== */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('🎉 Đã sao chép lời chúc thành công!');
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  showToast('🎉 Đã sao chép lời chúc thành công!');
}

function copySnippet(btnElement, text) {
  copyToClipboard(text);
  const originalHtml = btnElement.innerHTML;
  btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Đã sao chép!';
  setTimeout(() => {
    btnElement.innerHTML = originalHtml;
  }, 2000);
}

function showToast(message) {
  const toast = document.getElementById('toastMessage');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
