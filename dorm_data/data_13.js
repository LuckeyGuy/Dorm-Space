const dormsData13 = [
  {
    id: "dorm_13",
    name: "พรีม อพาร์ทเม้นท์",
    zone: ["zone-ling"],
    priceFan: 3400,
    priceAir: 4400,
    distance: "5.3 กม. จาก ม.แม่โจ้",
    address: "ซอยบ้านแม่โจ้ 9 ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.868523749729!2d99.03465729999999!3d18.892913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da232738cb9f8d%3A0x9bbd76c31f48cb22!2z4Lie4Lij4Li14LihIOC4reC4nuC4suC4o-C5jOC4l-C5gOC4oeC5ieC4meC4l-C5jA!5e0!3m2!1sth!2sth!4v1791211787452!5m2!1sth!2sth",
    images: [
      "../assets/image/13_1.jpg",
      "../assets/image/13_2.jpg",
      "../assets/image/13_3.jpg",
      "../assets/image/13_4.jpg"
    ],
    utilities: {
      electricity: "7 บาท/หน่วย",
      water: "100 บาท/เดือน",
      deposit: "1 เดือน",
      advance: "จ่ายล่วงหน้า 1 เดือน เข้าอยู่ได้เลย"
    },
    amenities: {
      inRoom: [
        "เครื่องปรับอากาศ / พัดลม",
        "เฟอร์นิเจอร์ครบชุด (ตู้เสื้อผ้า, เตียงนอน)",
        "เครื่องทำน้ำอุ่น",
        "อินเทอร์เน็ตไร้สาย (WiFi) ในห้องพัก"
      ],
      public: [
        "ประตูเข้า-ออก ระบบ Keycard",
        "ที่จอดรถกว้างขวาง",
        "ร้านซัก-รีด / บริการเครื่องซักผ้าหยอดเหรียญ"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "พัดลม",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "WiFi ฟรี",
        "ที่จอดรถ",
        "CCTV"
      ]
    },
    rules: {
      pets: "โปรดสอบถามข้อกำหนดเพิ่มเติมจากทางหอพัก"
    },
    contact: {
      line: "@DormSpaceMJU",
      phone: "094-919-9929",
      email: "contact@preemapartment.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm13)
     ===================================================== */
  const appointmentForm13 = document.getElementById("appointmentForm13");
  if (appointmentForm13) {
    appointmentForm13.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm13.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate13").value;
      const time = document.getElementById("apptTime13").value;
      const phone = document.getElementById("apptPhone13").value;
      const line = document.getElementById("apptLine13").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData13[0].id,
        dorm_name: dormsData13[0].name,
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
        appointmentForm13.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm13) - หน้าหอพัก
     ===================================================== */
  const bookingForm13 = document.getElementById("bookingForm13");
  if (bookingForm13) {
    bookingForm13.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType13");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 3400)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "3400";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate13"
      const moveDateInput = document.getElementById("bookMoveDate13");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData13[0] ? dormsData13[0].id : 'dorm_13',
        dorm_name: dormsData13[0] ? dormsData13[0].name : 'พรีม อพาร์ทเม้นท์',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }