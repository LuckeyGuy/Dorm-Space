// ==========================================
// script.js — Dorm Space Master UI Script
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // ==================== 1. MOUSE GLOW EFFECT ====================
  const glow = document.getElementById("cursorGlow");
  if (glow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateGlow = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      glow.style.left = `${currentX}px`;
      glow.style.top = `${currentY}px`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
  }

  // ==================== 2. EXCLUSIVE ACCORDION CONTROL ====================
  // เปิดได้ทีละ 1 การ์ด เมื่อเปิดใบใหม่ ใบเก่าจะหุบอัตโนมัติ
  const setupExclusiveAccordion = (selector) => {
    const items = document.querySelectorAll(selector);
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  };

  setupExclusiveAccordion(".zone-card-item");
  setupExclusiveAccordion(".vacancy-card");
  setupExclusiveAccordion(".checklist-item-card");
  setupExclusiveAccordion(".feature-card-item");

  // ==================== 3. LIFESTYLE FILTER (INDEX.HTML) ====================
  const filterBtns = document.querySelectorAll(".filter-pill-btn");
  const zoneCards = document.querySelectorAll(".zone-card-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");

      zoneCards.forEach((card) => {
        if (filterVal === "all") {
          card.classList.remove("is-dimmed");
        } else {
          const cardCat = card.getAttribute("data-category");
          if (cardCat === filterVal) {
            card.classList.remove("is-dimmed");
            card.open = true;
          } else {
            card.classList.add("is-dimmed");
            card.open = false;
          }
        }
      });
    });
  });

  // ==================== 4. COPY COUPON CODE ====================
  const copyPills = document.querySelectorAll(".code-copy-pill, .coupon-code-tag");
  copyPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const codeText = pill.textContent.trim();
      navigator.clipboard.writeText(codeText).then(() => {
        const originalText = pill.textContent;
        pill.textContent = "✓ คัดลอกโค้ดสำเร็จ!";
        pill.style.backgroundColor = "#10B981";
        pill.style.color = "#ffffff";
        setTimeout(() => {
          pill.textContent = originalText;
          pill.style.backgroundColor = "";
          pill.style.color = "";
        }, 1800);
      });
    });
  });

  // ==================== 5. SMOOTH HORIZONTAL SCROLL ====================
  const sliders = document.querySelectorAll(".places-slider, .feature-slider, .checklist-slider-track");
  sliders.forEach((slider) => {
    slider.addEventListener(
      "wheel",
      (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          slider.scrollBy({ left: e.deltaY * 1.5, behavior: "smooth" });
        }
      },
      { passive: false }
    );
  });

  // ==================== 6. DYNAMIC CATALOG LINK FIXER ====================
  // ปรับลิงก์การ์ดหอพักในหน้า catalog ให้วิ่งไปไฟล์แยกรายห้อง (เช่น dorm_01.html) อัตโนมัติ
  const productCards = document.querySelectorAll(".woo-product-card");
  productCards.forEach((card) => {
    const href = card.getAttribute("href");
    if (href && href.includes("dorm-detail.html?id=")) {
      const dormId = href.split("=")[1]; // เช่น dorm-01
      const fileName = dormId.replace("-", "_") + ".html"; // แปลงเป็น dorm_01.html
      card.setAttribute("href", fileName);
    }
  });

  console.log("Dorm Space UI Core Loaded Successfully ♡");
});