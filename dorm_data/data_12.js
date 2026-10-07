const dormsData12 = [
  {
    id: "dorm_12",
    name: "ไอ เรส แม่โจ้ ",
    zone: ["zone-eng"],
    priceFan: 4000,
    priceAir: 4000,
    distance: "910 ม. จาก ม.แม่โจ้",
    address: "ซอยบ้านสหกรณ์ 9 ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.9543172957206!2d99.0210549!3d18.889107700000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da234ee062b66b%3A0x11a1c84aad010a6d!2sI%20Residence%20at%20Maejo!5e0!3m2!1sth!2sth!4v1791211470307!5m2!1sth!2sth",
    images: [
      "../assets/image/12_1.jpg",
      "../assets/image/12_2.jpg",
      "../assets/image/12_3.jpg",
      "../assets/image/12_4.jpg"
    ],
    utilities: {
      electricity: "7 บาท/หน่วย",
      water: "150 บาท/เดือน",
      deposit: "1,000 บาท",
      advance: "จ่ายล่วงหน้า 1 เดือน เข้าอยู่ได้เลย"
    },
    amenities: {
      inRoom: [
        "เครื่องปรับอากาศ และเฟอร์นิเจอร์ครบชุด (เตียง, ตู้เสื้อผ้า, โต๊ะทำงาน)",
        "เครื่องทำน้ำอุ่น และสุขภัณฑ์อย่างดีพร้อม Rain Shower",
        "ทีวี, เคเบิลทีวี / ดาวเทียม และระเบียงส่วนตัว",
        "อินเทอร์เน็ตไร้สาย (WiFi) ในห้อง และประตูคีย์การ์ด"
      ],
      public: [
        "ห้องสมุด และห้องประชุมส่วนกลาง",
        "ลิฟต์โดยสารภายในอาคาร",
        "ที่จอดรถยนต์และจักรยานยนต์กว้างขวาง",
        "กล้องวงจรปิด (CCTV) เจ้าหน้าที่ดูแลความปลอดภัย",
        "และอินเทอร์เน็ต WiFi ความเร็วสูง",
        "ร้านซัก-รีด / เครื่องซักผ้า"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "ตู้เย็น",
        "ระเบียงส่วนตัว",
        "WiFi ฟรี",
        "ที่จอดรถ",
        "CCTV"
      ]
    },
    rules: {
      pets: "ไม่อนุญาตให้เลี้ยงสัตว์ทุกชนิด"
    },
    contact: {
      line: "@DormSpaceMJU",
      phone: "053-353-243",
      email: "contact@iresidenceatmaejo.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm12)
     ===================================================== */
  const appointmentForm12 = document.getElementById("appointmentForm12");
  if (appointmentForm12) {
    appointmentForm12.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm12.querySelector('button[type="submit"]');
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
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      const date = document.getElementById("apptDate12").value;
      const time = document.getElementById("apptTime12").value;
      const phone = document.getElementById("apptPhone12").value;
      const line = document.getElementById("apptLine12").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData12[0].id,
        dorm_name: dormsData12[0].name,
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
        appointmentForm12.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm12) - หน้าหอพัก
     ===================================================== */
  const bookingForm12 = document.getElementById("bookingForm12");
  if (bookingForm12) {
    bookingForm12.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType12");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 4000)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "4000";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate12"
      const moveDateInput = document.getElementById("bookMoveDate12");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData12[0] ? dormsData12[0].id : 'dorm_12',
        dorm_name: dormsData12[0] ? dormsData12[0].name : 'ไอ เรส แม่โจ้',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }