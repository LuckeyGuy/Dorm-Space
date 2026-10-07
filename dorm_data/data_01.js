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
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการนัดหมายค่ะ ✨");
        if (submitBtn) submitBtn.disabled = false;
        window.location.href = "../auth.html";
        return;
      }

      // เช็คจำนวน active ในระบบ
      const { count, error: countErr } = await supabaseClient
        .from("appointments")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", session.user.id)
        .eq("status", "active");

      if (!countErr && count > 0) {
        alert("ท่านมีรายการนัดดูห้องที่กำลังใช้งานอยู่แล้วค่ะ! (สามารถมีได้ 1 รายการ จนกว่าจะยกเลิกรายการเดิมในหน้าการจองของฉัน)");
        if (submitBtn) submitBtn.disabled = false; // ปลดล็อกปุ่มให้กดใหม่ได้
        return;
      }

      const date = document.getElementById("apptDate").value;
      const time = document.getElementById("apptTime").value;
      const phone = document.getElementById("apptPhone").value;
      const line = document.getElementById("apptLine").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dorm.id,
        dorm_name: dorm.name,
        appointment_date: date,
        time_slot: time,
        contact_phone: phone,
        contact_line: line,
        status: 'active'
      });

      if (error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
        if (submitBtn) submitBtn.disabled = false; // ปลดล็อกถ้าเกิด error
      } else {
        alert("✓ บันทึกการนัดหมายดูห้องสำเร็จแล้วค่ะ!");
        appointmentForm.reset();
        // ไม่ต้องเปิดปุ่มละ เพราะจะรีเฟรชหรือเปลี่ยนหน้า
        location.reload(); // รีเฟรชหน้าจออัปเดตสถานะทันที
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
        window.location.href = "../auth.html"; // ปรับ path ตามตำแหน่งโฟลเดอร์จริง
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "3000";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate"
      const moveDateInput = document.getElementById("bookMoveDate");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dorm ? dorm.id : 'dorm_01',
        dorm_name: dorm ? dorm.name : 'หอพักตัวอย่าง',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html (ปรับ path ../ ให้ตรงกับตำแหน่งไฟล์จริง เช่น ถ้าไฟล์อยู่ข้างนอกให้ใช้ ../booking.html)
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }