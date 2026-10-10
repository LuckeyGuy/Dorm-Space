const dormsData01 = [
  {
    id: "dorm_01",
    name: "หอพักตัวอย่าง",
    zone: ["zone-front", "zone-eng", "zone-ling"],
    priceFan: 3000,
    priceAir: 3500,
    distance: "1.2 กม. จาก ม.แม่โจ้",
    address: "63 ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.55!2d98.99!3d18.89!2m3!1f0!2f0!3f0!3m2!1f1024!2f768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDUzJzI0LjAiTiA5OMKwNTknMjQuMCJF!5e0!3m2!1sth!2sth!4v1620000000000!5m2!1sth!2sth",
    images: [
      "../assets/image/01_1.jpg",
      "../assets/image/01_2.jpg",
      "../assets/image/01_3.jpg",
      "../assets/image/01_4.jpg"
    ],
    utilities: {
      electricity: "8 บาท/หน่วย",
      water: "100 บาท/เดือน",
      deposit: "1,000 บาท",
      advance: "จ่ายล่วงหน้า 1 เดือนเข้าอยู่ได้เลย"
    },
    amenities: {
      inRoom: [
        "เครื่องปรับอากาศ / พัดลม",
        "เฟอร์นิเจอร์ครบชุด (เตียง, ตู้เสื้อผ้า, โต๊ะทำงาน)",
        "เครื่องทำน้ำอุ่น, ตู้เย็น, ไมโครเวฟ",
        "ระเบียงส่วนตัว"
      ],
      public: [
        "ที่จอดรถกว้างขวาง",
        "กล้องวงจรปิด (CCTV) และเจ้าหน้าที่ดูแล",
        "อินเทอร์เน็ตไร้สาย (WiFi) ความเร็วสูง",
        "ร้านซัก-รีด และฟิตเนสภายในโครงการ"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "พัดลม",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "ตู้เย็น",
        "ไมโครเวฟ",
        "ระเบียงส่วนตัว",
        "อนุญาตให้เลี้ยงสัตว์"
      ]
    },
    rules: {
      pets: "ไม่อนุญาตให้เลี้ยงสัตว์ทุกชนิด"
    },
    contact: {
      line: "@baansuan_mju",
      phone: "081-234-5678",
      email: "contact@baansuanmju.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm)
     ===================================================== */
  const appointmentForm = document.getElementById("appointmentForm");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการนัดหมายค่ะ ✨");
        if (submitBtn) submitBtn.disabled = false;
        window.location.href = "../auth.html";
        return;
      }

      const { count, error: countErr } = await supabaseClient
        .from("appointments")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", session.user.id)
        .eq("status", "active");

      if (!countErr && count > 0) {
        alert("ท่านมีรายการนัดดูห้องที่กำลังใช้งานอยู่แล้วค่ะ! (สามารถมีได้ 1 รายการ จนกว่าจะยกเลิกรายการเดิมในหน้าการจองของฉัน)");
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      const date = document.getElementById("apptDate").value;
      const time = document.getElementById("apptTime").value;
      const phone = document.getElementById("apptPhone").value;
      const line = document.getElementById("apptLine").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData01[0].id,
        dorm_name: dormsData01[0].name,
        appointment_date: date,
        time_slot: time,
        contact_phone: phone,
        contact_line: line,
        status: 'active'
      });

      if (error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
        if (submitBtn) submitBtn.disabled = false;
      } else {
        alert("✓ บันทึกการนัดหมายดูห้องสำเร็จแล้วค่ะ!");
        appointmentForm.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm) - หน้าหอพัก
     ===================================================== */
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      const roomTypeSelect = document.getElementById("bookRoomType");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "3000";

      const moveDateInput = document.getElementById("bookMoveDate");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      const queryParams = new URLSearchParams({
        dorm_id: dormsData01[0] ? dormsData01[0].id : 'dorm_01',
        dorm_name: dormsData01[0] ? dormsData01[0].name : 'หอพักตัวอย่าง',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }

  /* =====================================================
     จัดการโหลดรีวิวจาก Supabase (loadReviewsFromSupabase)
     ===================================================== */
  const loadReviewsFromSupabase = async () => {
    const ropeTrack = document.getElementById("ropeReviewTrack");
    const topRatingBadge = document.getElementById("topRatingBadge");
    if (!ropeTrack) return;

    let reviewsToDisplay = [];

    try {
      const { data, error } = await supabaseClient
        .from("reviews")
        .select("*")
        .eq("dorm_id", currentDormId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        reviewsToDisplay = data.map(r => ({
          author_name: r.author_name,
          rating: r.rating,
          comment: r.comment
        }));
      }
    } catch (err) {
      console.log("Using default local reviews");
    }

    if (reviewsToDisplay.length > 0) {
      let totalRating = 0;
      reviewsToDisplay.forEach(r => totalRating += r.rating);
      const avgRating = (totalRating / reviewsToDisplay.length).toFixed(1);
      if (topRatingBadge) {
        topRatingBadge.innerHTML = `⭐ ${avgRating}`;
      }
    } else {
      if (topRatingBadge) {
        topRatingBadge.innerHTML = `⭐ ยังไม่มีรีวิว`;
      }
      ropeTrack.innerHTML = `<div style="text-align: center; padding: 60px; color: var(--text-secondary); width: 100%;"><br/><br/>ยังไม่มีรีวิวสำหรับหอพักนี้ เป็นคนแรกที่รีวิวเลยสิคะ! ✍️✨</div>`;
      return;
    }

    ropeTrack.innerHTML = "";
    reviewsToDisplay.forEach((rev, index) => {
      const starsStr = "★".repeat(rev.rating);
      const theme = pastelPaperPairs[index % pastelPaperPairs.length];
      const card = document.createElement("div");
      card.className = "hanging-card-item";
      card.innerHTML = `
        <svg class="hanging-strap" viewBox="0 0 18 50">
          <path d="M4 0 H14 A2 2 0 0 1 16 2 V47 A3 3 0 0 1 13 50 H5 A3 3 0 0 1 2 47 V2 A2 2 0 0 1 4 0 Z" fill="${theme.strap}"/>
          <rect x="0.5" y="19" width="17" height="6" rx="2" fill="#fae498"/>
        </svg>
        <div class="hanging-card-back-sheet" style="background-color: ${theme.backBg};"></div>
        <div class="hanging-card-face" style="background-color: ${theme.frontBg}; border-color: ${theme.border};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <b style="font-size: 14.5px; color: var(--text-primary);">${rev.author_name}</b>
            <span style="color: ${theme.starColor}; font-size: 13px; letter-spacing: 1px;">${starsStr}</span>
          </div>
          <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin: 0;">${rev.comment}</p>
        </div>
      `;
      ropeTrack.appendChild(card);
    });

    initRopeReviews();
  };