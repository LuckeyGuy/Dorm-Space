const dormsData06 = [
  {
    id: "dorm_06",
    name: "แอทสิงห์ (At Singh)",
    zone: ["zone-eng"],
    priceFan: 3500,
    priceAir: 4500,
    distance: "900 ม. จาก ม.แม่โจ้",
    address: "ซอยวัดทุ่งหมื่นน้อย ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.9100957815685!2d99.0150395!3d18.891069199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da23a6c6300949%3A0x10c40745c881281!2z4LmB4Lit4LiX4Liq4Li04LiH4Lir4LmMIDIg4LmB4Lih4LmI4LmC4LiI4LmJ!5e0!3m2!1sth!2sth!4v1791185569018!5m2!1sth!2sth",
    images: [
      "../assets/image/06_1.jpg",
      "../assets/image/06_2.jpg",
      "../assets/image/06_3.jpg",
      "../assets/image/06_4.jpg"
    ],
    utilities: {
      electricity: "8 บาท/หน่วย",  
      water: "ตามหน่วยที่ใช้ (หรือเหมาจ่ายตามข้อกำหนด)",
      deposit: "5,000 บาท",
      advance: "ชำระเงินประกันและค่าเช่าล่วงหน้าก่อนเข้าอยู่"
    },
    amenities: {
      inRoom: [
        "เครื่องปรับอากาศประหยัดไฟเบอร์ 5",
        "ชุดเฟอร์นิเจอร์ Built-in ทันสมัย (เตียง, ตู้เสื้อผ้าใหญ่, โต๊ะทำงาน)",
        "เครื่องทำน้ำอุ่น",
        "ซิงค์ล้างจานบริเวณระเบียง"
      ],
      public: [
        "ระบบรักษาความปลอดภัย 24 ชม. พร้อมกล้อง CCTV และ Key Card",
        "ที่จอดรถยนต์และจักรยานยนต์เป็นสัดส่วน",
        "อินเทอร์เน็ต WiFi ความเร็วสูงแยกแต่ละห้อง",
        "พื้นที่นั่งเล่นส่วนกลาง และตู้บริการหยอดเหรียญ"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "ระเบียงส่วนตัว",
        "WiFi ฟรี",
        "ที่จอดรถ",
        "CCTV"
      ]
    },
    rules: {
      pets: "ไม่อนุญาตให้เลี้ยงสัตว์ทุกชนิด และห้ามสูบบุหรี่ภายในห้องพัก/พื้นที่ส่วนกลาง"
    },
    contact: {
      line: "@DormSpaceMJU",
      phone: "ติดต่อผ่านแอดมิน",
      email: "contact@atsinghmju.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm06)
     ===================================================== */
  const appointmentForm06 = document.getElementById("appointmentForm06");
  if (appointmentForm06) {
    appointmentForm06.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm06.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate06").value;
      const time = document.getElementById("apptTime06").value;
      const phone = document.getElementById("apptPhone06").value;
      const line = document.getElementById("apptLine06").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData06[0].id,
        dorm_name: dormsData06[0].name,
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
        appointmentForm06.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm06) - หน้าหอพัก
     ===================================================== */
  const bookingForm06 = document.getElementById("bookingForm06");
  if (bookingForm06) {
    bookingForm06.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType06");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 3500)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "3500";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate06"
      const moveDateInput = document.getElementById("bookMoveDate06");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData06[0] ? dormsData06[0].id : 'dorm_06',
        dorm_name: dormsData06[0] ? dormsData06[0].name : 'แอทสิงห์ (At Singh)',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }