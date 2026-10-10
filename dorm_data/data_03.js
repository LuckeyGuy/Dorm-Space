const dormsData03 = [
  {
    id: "dorm_03",
    name: "หอพักสายพิน",
    zone: ["zone-eng"], // โซนประตูวิศวะ
    priceFan: 2200,
    priceAir: 3200,
    distance: "ใกล้ประตูวิศวะเพียงไม่กี่ก้าว",
    address: "ฝั่งประตูวิศวะ (ประตูหลังมอ) มหาวิทยาลัยแม่โจ้",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.9082019243347!2d99.0130001!3d18.891153199999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da234cac8fc853%3A0x2ddb488a79fe6dda!2z4Lir4Lit4Lie4Lix4LiB4Liq4Liy4Lii4Liq4Lih4Lij!5e0!3m2!1sth!2sth!4v1791131471037!5m2!1sth!2sth",
    images: [
      "../assets/image/03_1.jpg",
      "../assets/image/03_2.jpg",
      "../assets/image/03_3.jpg",
      "../assets/image/03_4.jpg"
    ],
    utilities: {
      electricity: "8 บาท/หน่วย",
      water: "เหมาจ่าย 100 – 150 บาท/เดือน",
      deposit: "3,000 - 4,000 บาท",
      advance: "จ่ายล่วงหน้า 1 เดือน + เงินประกัน เข้าอยู่ได้ทันที"
    },
    amenities: {
      inRoom: [
        "เฟอร์นิเจอร์พื้นฐาน (เตียงนอน, ตู้เสื้อผ้า, โต๊ะเครื่องแป้ง)",
        "เครื่องปรับอากาศ / พัดลม",
        "ห้องน้ำในตัวพร้อมเครื่องทำน้ำอุ่น",
        "ระเบียงส่วนตัวสำหรับซักล้าง"
      ],
      public: [
        "ที่จอดรถจักรยานยนต์กว้างขวาง",
        "ระบบรักษาความปลอดภัยด้วยกล้อง CCTV และประตูคีย์การ์ด",
        "อินเทอร์เน็ต WiFi ครอบคลุมทั่วถึง",
        "เครื่องซักผ้าหยอดเหรียญบริการภายในหอพัก"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "พัดลม",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "ระเบียงส่วนตัว"
      ]
    },
    rules: {
      pets: "ไม่อนุญาตให้เลี้ยงสัตว์ทุกชนิด และขอความร่วมมืองดใช้เสียงดังหลังเวลา 22:00 น."
    },
    contact: {
      line: "@DormSpaceMJU",
      phone: "089-701-1191",
      email: "DormSpace.official@mju.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm03)
     ===================================================== */
  const appointmentForm03 = document.getElementById("appointmentForm03");
  if (appointmentForm03) {
    appointmentForm03.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm03.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate03").value;
      const time = document.getElementById("apptTime03").value;
      const phone = document.getElementById("apptPhone03").value;
      const line = document.getElementById("apptLine03").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData03[0].id,
        dorm_name: dormsData03[0].name,
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
        appointmentForm03.reset();
        location.reload(); // รีเฟรชหน้าจออัปเดตสถานะทันที
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm03) - หน้าหอพัก
     ===================================================== */
  const bookingForm03 = document.getElementById("bookingForm03");
  if (bookingForm03) {
    bookingForm03.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html"; // ปรับ path ตามตำแหน่งโฟลเดอร์จริง
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType03");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้นห้องพัดลมของหอ 3 คือ 2200)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "2200";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate03"
      const moveDateInput = document.getElementById("bookMoveDate03");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData03[0] ? dormsData03[0].id : 'dorm_03',
        dorm_name: dormsData03[0] ? dormsData03[0].name : 'หอพักสายพิน',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }