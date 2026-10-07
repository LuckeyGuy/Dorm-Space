const dormsData11 = [
  {
    id: "dorm_11",
    name: "มายเฮาส์ 5 @แม่โจ้",
    zone: ["zone-front"],
    priceFan: 4500,
    priceAir: 4500,
    distance: "500 ม. จาก ม.แม่โจ้",
    address: "ซอย 1 ทุ่งหมื่นน้อย ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.912738149771!2d99.00950859999999!3d18.890952000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3d0031e96a4b%3A0xdd32abce922300c1!2z4Lir4Lit4Lie4Lix4LiBIE15IEhvdXNlIDU!5e0!3m2!1sth!2sth!4v1791211356169!5m2!1sth!2sth",
    images: [
      "../assets/image/11_1.jpg",
      "../assets/image/11_2.jpg",
      "../assets/image/11_3.jpg",
      "../assets/image/11_4.jpg"
    ],
    utilities: {
      electricity: "8 บาท/หน่วย",
      water: "100 บาท/เดือน",
      deposit: "1,000 บาท",
      advance: "จ่ายล่วงหน้า 1 เดือน เข้าอยู่ได้เลย"
    },
    amenities: {
      inRoom: [
        "ห้องขนาด 25 ตรม. พร้อมระเบียงส่วนตัว",
        "เฟอร์นิเจอร์ Built-in สไตล์ Minimal ",
        "เครื่องปรับอากาศ 12,000 BTU & เครื่องทำน้ำอุ่น",
        "TV LED 32 นิ้ว, ตู้เย็น, อ่างซิงค์ล้างจาน และผ้าม่านหนากันแดดกัน UV"
      ],
      public: [
        "ที่จอดรถยนต์และจักรยานยนต์จำนวนมาก",
        "กล้องวงจรปิด (CCTV) มากถึง 48 ตัว และประตู Keycard",
        "อินเทอร์เน็ตไร้สาย (WiFi) ความเร็วสูง",
        "เครื่องซักผ้าหยอดเหรียญ และตู้น้ำดื่มหยอดเหรียญ"
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
      line: "Myhouse_5",
      phone: "062-952-4424",
      email: "contact@myhouseapartment5.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm11)
     ===================================================== */
  const appointmentForm11 = document.getElementById("appointmentForm11");
  if (appointmentForm11) {
    appointmentForm11.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm11.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate11").value;
      const time = document.getElementById("apptTime11").value;
      const phone = document.getElementById("apptPhone11").value;
      const line = document.getElementById("apptLine11").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData11[0].id,
        dorm_name: dormsData11[0].name,
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
        appointmentForm11.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm11) - หน้าหอพัก
     ===================================================== */
  const bookingForm11 = document.getElementById("bookingForm11");
  if (bookingForm11) {
    bookingForm11.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType11");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 4500)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "4500";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate11"
      const moveDateInput = document.getElementById("bookMoveDate11");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData11[0] ? dormsData11[0].id : 'dorm_11',
        dorm_name: dormsData11[0] ? dormsData11[0].name : 'มายเฮาส์ 5 @แม่โจ้',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }