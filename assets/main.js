/**
 * Akbar Koulivand Lawyer Website - Core Interactions
 * Pure Vanilla JavaScript (Zero Framework / Zero Build)
 */

const LEGAL_CONFIG = {
  TELEGRAM_URL: 'https://t.me/Lawyerakbarkulivand',
  RUBIKA_URL: 'https://rubika.ir/Lawyerakbarkulivand',
  PHONE_NUMBER: '09967766033',
  TELEPHONE_DISPLAY: '۰۹۹۶ ۷۷۶۶ ۰۳۳',
};

// Open Consultation Modal
function openConsultationModal(serviceName) {
  const modal = document.getElementById('consultation-modal');
  const badge = document.getElementById('modal-service-badge');
  if (badge) {
    badge.textContent = serviceName || 'مشاوره حقوقی';
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Close Consultation Modal
function closeConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Navigate to Platform (Telegram or Rubika)
function navigateToPlatform(platform) {
  let url = LEGAL_CONFIG.TELEGRAM_URL;
  if (platform === 'rubika') {
    url = LEGAL_CONFIG.RUBIKA_URL;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
  closeConsultationModal();
}

// Toggle Mobile Menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeConsultationModal();
    }
  });

  // Close modal when clicking on backdrop
  const modal = document.getElementById('consultation-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeConsultationModal();
      }
    });
  }

  // Smooth Seal Processing for transparent luxury emblem
  processSealImages();
});

// Process seal transparent cutouts in pure browser canvas
function processSealImages() {
  const sealImgs = document.querySelectorAll('.dynamic-seal-img');
  sealImgs.forEach((img) => {
    const originalSrc = img.getAttribute('data-src') || img.src;
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';

    tempImg.onload = () => {
      try {
        const width = tempImg.naturalWidth || 800;
        const height = tempImg.naturalHeight || 450;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(tempImg, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const cx = width / 2;
        const cy = height / 2;
        const rx = width * 0.485;
        const ry = height * 0.465;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const dx = (x - cx) / rx;
            const dy = (y - cy) / ry;
            const distSq = dx * dx + dy * dy;

            if (distSq > 1.0) {
              data[i + 3] = 0;
            } else if (distSq > 0.94) {
              const fade = (1.0 - distSq) / 0.06;
              data[i + 3] = Math.round(data[i + 3] * Math.max(0, Math.min(1, fade)));
            } else {
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              if (lum < 40) {
                data[i + 3] = 0;
              } else if (lum < 75) {
                data[i + 3] = Math.round(((lum - 40) / 35) * 255);
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        img.src = canvas.toDataURL('image/png');
      } catch (err) {
        console.log('Using default seal mask styling');
      }
    };

    tempImg.src = originalSrc;
  });
}
