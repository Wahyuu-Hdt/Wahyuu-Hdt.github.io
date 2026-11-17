/* ============================================================
   WAHYU HIDAYATULLAH — Portfolio Scripts
   Smooth scrolling · Scroll reveal · Navbar active state
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── ELEMENTS ─── */
  const navItems    = document.querySelectorAll('.nav-item');
  const sections    = document.querySelectorAll('section[id]');
  const mobileToggle= document.getElementById('mobile-nav-toggle');
  const navbar      = document.getElementById('navbar');
  const reveals     = document.querySelectorAll(
    '.section-label, .section-heading, .about-text, .about-details,' +
    '.project-card, .skill-block, .contact-inner, .hero-left, .hero-right,' +
    '.detail-card, .badge'
  );

  /* ─── SMOOTH SCROLL ─── */
  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const targetId = item.getAttribute('href').substring(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      const offset = 80;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // close mobile nav
      if (navbar.classList.contains('show')) {
        navbar.classList.remove('show');
        mobileToggle.classList.remove('open');
      }
    });
  });

  /* ─── ACTIVE NAV ON SCROLL ─── */
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.pageYOffset >= top) current = sec.id;
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });
  }

  /* ─── SCROLL REVEAL ─── */
  function handleReveal() {
    const trigger = window.innerHeight * 0.88;
    reveals.forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  /* ─── SCROLL HANDLER ─── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        handleReveal();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ─── MOBILE TOGGLE ─── */
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navbar.classList.toggle('show');
    });
  }

  /* ─── INITIAL CALLS ─── */
  updateActiveNav();
  handleReveal();


  /* ═══════════════════════════════════════════════════════════════
     CAROUSEL — Olist Dashboard Slider
     ═══════════════════════════════════════════════════════════════ */
  /* Interactive skill notes */
  const skillNotes = {
    'sql': 'Menyusun kueri untuk mengambil, menggabungkan, menyaring, dan merangkum data dari basis data relasional.',
    'python': 'Menggunakan Python untuk menyiapkan data, mengeksplorasi pola, dan mengotomatisasi analisis.',
    'power-bi': 'Membangun dasbor interaktif untuk menyajikan indikator, tren, dan temuan secara ringkas.',
    'dax': 'Membuat ukuran dan perhitungan khusus agar analisis serta indikator di Power BI lebih fleksibel.',
    'data-cleaning': 'Menangani nilai kosong, duplikasi, format, dan tipe data agar data siap dianalisis.',
    'exploratory-analysis': 'Menelaah bentuk data, distribusi, hubungan, dan anomali untuk menemukan pola awal.',
    'statistical-analysis': 'Menggunakan ringkasan dan metode statistik untuk membaca pola serta membandingkan data.',
    'data-visualization': 'Memilih grafik yang tepat agar perbandingan, perubahan, dan hubungan data mudah dipahami.',
    'dashboard-development': 'Menyusun KPI, filter, dan grafik dalam satu tampilan yang mendukung eksplorasi data.',
    'kpi-monitoring': 'Memantau perubahan indikator dari waktu ke waktu sebagai bahan evaluasi dan tindak lanjut.',
    'business-process-analysis': 'Memetakan alur kerja untuk memahami hambatan, kebutuhan, dan peluang perbaikan.',
    'requirements-analysis': 'Menggali kebutuhan pengguna dan menerjemahkannya menjadi kebutuhan solusi yang jelas.',
    'problem-solving': 'Mendefinisikan masalah, memeriksa bukti, lalu menyusun langkah penyelesaian yang terukur.',
    'data-driven-decisions': 'Menghubungkan temuan analisis dengan pilihan tindakan dan alasan yang dapat dijelaskan.',
    'google-colab': 'Menjalankan dan mendokumentasikan analisis Python melalui notebook yang bisa diakses di peramban.',
    'github': 'Menyimpan dan mengelola versi kode serta dokumentasi proyek analisis.',
    'excel': 'Mengolah tabel, menggunakan rumus, dan merangkum data untuk analisis serta pelaporan.',
    'pandas': 'Membersihkan, menyaring, menggabungkan, dan merangkum data berbentuk tabel dengan Python.',
    'numpy': 'Melakukan perhitungan numerik dan operasi array yang mendukung analisis Python.'
  };

  document.querySelectorAll('.skill-block').forEach(block => {
    const detail = block.querySelector('.skill-detail');
    if (!detail) return;
    const title = detail.querySelector('.skill-detail-title');
    const copy = detail.querySelector('.skill-detail-copy');

    block.querySelectorAll('button[data-skill]').forEach(button => {
      button.addEventListener('click', () => {
        const wasSelected = button.getAttribute('aria-expanded') === 'true';
        block.querySelectorAll('button[data-skill]').forEach(item => {
          item.setAttribute('aria-expanded', 'false');
          item.classList.remove('is-selected');
        });
        if (wasSelected) {
          detail.hidden = true;
          return;
        }

        button.setAttribute('aria-expanded', 'true');
        button.classList.add('is-selected');
        title.textContent = button.querySelector(':scope > span:last-child')?.textContent || button.textContent.trim();
        copy.textContent = skillNotes[button.dataset.skill] || '';
        detail.hidden = false;
      });
    });
  });

  /* ID card pendulum: rotasi + tali elastis, Pointer Events, loop yang bisa tidur. */
  const idCard = document.querySelector('.hero-id-card');
  const idSwing = document.querySelector('.hero-id-swing');
  const idPivot = document.querySelector('.hero-id-pivot');
  const idLanyard = document.querySelector('.hero-id-lanyard');

  if (idCard && idSwing && idPivot && idLanyard) {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const springStrength = 20;     // kekuatan tarikan balik ayunan
    const angularDamping = 2.2;    // makin kecil, makin lama berayun
    const stretchStrength = 70;    // kekuatan pegas tali
    const stretchDamping = 5;      // makin kecil, makin banyak memantul
    const maxAngle = 1.1;          // batas ayunan (radian, sekitar 63 derajat)
    const minStretch = -30;        // tali paling pendek (px)
    const maxStretch = 70;         // tali paling panjang (px)
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    let angle = motionPreference.matches ? 0 : -0.35;
    let angularVelocity = 0;
    let stretch = 0;
    let stretchVelocity = 0;
    let baseLength = idLanyard.offsetHeight;

    let frameId = 0;
    let previousFrameTime = 0;
    let dragging = false;
    let activePointerId = null;
    let dragOffset = 0;
    let grabDistance = 0;
    let previousPointerTime = 0;

    function isSettled() {
      return Math.abs(angle) < 0.0015 && Math.abs(angularVelocity) < 0.009 &&
             Math.abs(stretch) < 0.2 && Math.abs(stretchVelocity) < 0.5;
    }

    function renderIdCard() {
      idSwing.style.transform = 'translateX(-50%) rotate(' + angle + 'rad)';
      const length = Math.max(40, baseLength + stretch) + 'px';
      idLanyard.style.height = length;
      idLanyard.style.flexBasis = length;
    }

    function readBaseLength() {
      idLanyard.style.height = '';
      idLanyard.style.flexBasis = '';
      baseLength = idLanyard.offsetHeight;
      renderIdCard();
    }

    function stopIdCardAnimation() {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      previousFrameTime = 0;
    }

    function animateIdCard(time) {
      frameId = 0;
      if (document.hidden || motionPreference.matches || dragging) return;

      const elapsed = previousFrameTime ? Math.min((time - previousFrameTime) / 1000, 0.032) : 1 / 60;
      previousFrameTime = time;

      const angleAcc = -springStrength * angle - angularDamping * angularVelocity;
      angularVelocity += angleAcc * elapsed;
      angle = clamp(angle + angularVelocity * elapsed, -maxAngle, maxAngle);

      const stretchAcc = -stretchStrength * stretch - stretchDamping * stretchVelocity;
      stretchVelocity += stretchAcc * elapsed;
      stretch = clamp(stretch + stretchVelocity * elapsed, minStretch, maxStretch);

      if (isSettled()) {
        angle = 0; angularVelocity = 0; stretch = 0; stretchVelocity = 0;
        previousFrameTime = 0;
        renderIdCard();
        return;
      }

      renderIdCard();
      frameId = window.requestAnimationFrame(animateIdCard);
    }

    function startIdCardAnimation() {
      if (frameId || dragging || document.hidden || motionPreference.matches) return;
      if (isSettled()) {
        angle = 0; angularVelocity = 0; stretch = 0; stretchVelocity = 0;
        renderIdCard();
        return;
      }
      previousFrameTime = 0;
      frameId = window.requestAnimationFrame(animateIdCard);
    }

    // posisi pointer relatif ke titik gantung: sudut + jarak
    function pointerPolar(event) {
      const r = idPivot.getBoundingClientRect();
      const dx = event.clientX - (r.left + r.width / 2);
      const dy = event.clientY - (r.top + r.height / 2);
      return { angle: Math.atan2(-dx, dy), dist: Math.hypot(dx, dy) };  // tanda dx dibalik: cocok dengan rotate() CSS
    }

    function beginCardDrag(event) {
      if (motionPreference.matches || !event.isPrimary) return;
      event.preventDefault();
      stopIdCardAnimation();
      dragging = true;
      activePointerId = event.pointerId;
      idCard.classList.add('is-dragging');
      idCard.setPointerCapture(event.pointerId);
      const p = pointerPolar(event);
      dragOffset = angle - p.angle;
      grabDistance = p.dist - stretch;
      previousPointerTime = event.timeStamp;
      angularVelocity = 0;
      stretchVelocity = 0;
    }

    function moveCardDrag(event) {
      if (!dragging || event.pointerId !== activePointerId) return;
      event.preventDefault();
      const p = pointerPolar(event);
      const nextAngle = clamp(p.angle + dragOffset, -maxAngle, maxAngle);
      const nextStretch = clamp((p.dist - grabDistance) * 0.6, minStretch, maxStretch); // 0.6 = efek karet
      const elapsed = Math.max((event.timeStamp - previousPointerTime) / 1000, 0.008);
      angularVelocity = clamp((nextAngle - angle) / elapsed, -6, 6);
      stretchVelocity = clamp((nextStretch - stretch) / elapsed, -600, 600);
      angle = nextAngle;
      stretch = nextStretch;
      previousPointerTime = event.timeStamp;
      renderIdCard();
    }

    function endCardDrag(event) {
      if (!dragging || event.pointerId !== activePointerId) return;
      dragging = false;
      idCard.classList.remove('is-dragging');
      activePointerId = null;
      startIdCardAnimation();
    }

    function applyMotionPreference(event) {
      if (!event.matches) return;
      stopIdCardAnimation();
      dragging = false;
      activePointerId = null;
      angle = 0; angularVelocity = 0; stretch = 0; stretchVelocity = 0;
      idCard.classList.remove('is-dragging');
      renderIdCard();
    }

    idCard.addEventListener('pointerdown', beginCardDrag);
    idCard.addEventListener('pointermove', moveCardDrag);
    idCard.addEventListener('pointerup', endCardDrag);
    idCard.addEventListener('pointercancel', endCardDrag);
    idCard.addEventListener('lostpointercapture', endCardDrag);
    motionPreference.addEventListener('change', applyMotionPreference);
    window.addEventListener('resize', readBaseLength);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        dragging = false;
        idCard.classList.remove('is-dragging');
        const pointerId = activePointerId;
        activePointerId = null;
        if (pointerId !== null && idCard.hasPointerCapture(pointerId)) {
          idCard.releasePointerCapture(pointerId);
        }
        stopIdCardAnimation();
      } else {
        startIdCardAnimation();
      }
    });

    renderIdCard();
    startIdCardAnimation();
  }

  const track   = document.getElementById('olist-track');
  const slides  = track ? track.querySelectorAll('.carousel-slide') : [];
  const prevBtn = document.getElementById('olist-prev');
  const nextBtn = document.getElementById('olist-next');
  const dots    = document.getElementById('olist-dots');
  const counter = document.getElementById('olist-counter');
  const label   = document.getElementById('olist-label');
  const total   = slides.length;
  let current   = 0;

  function goToSlide(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;

    // Move track
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    // Update dots
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Update counter
    counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');

    // Update label
    label.textContent = slides[current].dataset.label;
  }

  if (track && total > 0) {
    prevBtn.addEventListener('click', () => goToSlide(current - 1));
    nextBtn.addEventListener('click', () => goToSlide(current + 1));

    // Dot clicks
    dots.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index, 10));
      });
    });

    // Keyboard navigation when carousel is focused
    document.getElementById('olist-carousel').addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goToSlide(current - 1);
      if (e.key === 'ArrowRight') goToSlide(current + 1);
    });

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX   = 0;
    const viewport  = track.parentElement;

    viewport.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {          // 50px threshold
        if (diff > 0) goToSlide(current + 1);   // swipe left  → next
        else          goToSlide(current - 1);   // swipe right → prev
      }
    }, { passive: true });
  }
});
