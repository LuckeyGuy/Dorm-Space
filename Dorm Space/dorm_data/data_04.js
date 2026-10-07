const dormsData04 = [
  {
    id: "dorm_04", // 👈 เปลี่ยนเป็นขีดล่าง
    name: "2B Place",
    zone: ["zone-ling"],
    priceFan: 3600,
    priceAir: 3600,
    distance: "1.3 กม. จาก ม.แม่โจ้ (ซ.บ้านหลิ่งมื่น 2/1)",
    address: "ซอยบ้านหลิ่งมื่น 2/1 ต.หนองหาร อ.สันทราย จ.เชียงใหม่",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.0397313086532!2d99.0168593!3d18.8853185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da2352735ccdd7%3A0x4803340d9b2de4a!2z4LmA4Lij4Li34Lit4LiZ4LiK4Liy4LiN4LiX4Lit4LiH4LiB4Lij!5e0!3m2!1sth!2sth!4v1791132623800!5m2!1sth!2sth",
    images: [
      "../assets/image/04_1.jpg",
      "../assets/image/04_2.jpg",
      "../assets/image/04_3.jpg",
      "../assets/image/04_4.jpg"
    ],
    utilities: {
      electricity: "7 บาท/หน่วย",
      water: "100 บาท/เดือน",
      deposit: "4,000 บาท",
      advance: "จ่ายล่วงหน้า 1 เดือน เข้าอยู่ได้ทันที"
    },
    amenities: {
      inRoom: [
        "เครื่องปรับอากาศ & เครื่องทำน้ำอุ่น",
        "ทีวี & ตู้เย็น",
        "เฟอร์นิเจอร์ครบชุด (เตียงนอน, ตู้เสื้อผ้า, โต๊ะเครื่องแป้ง)",
        "ฟรีอินเทอร์เน็ตไร้สาย (WiFi) ในห้องพัก",
        "ระบบรักษาความปลอดภัยประตูคีย์การ์ด"
      ],
      public: [
        "ที่จอดรถกว้างขวาง",
        "กล้องวงจรปิด (CCTV) ดูแลความปลอดภัย",
        "เจ้าหน้าที่ดูแลความปลอดภัย"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "ตู้เย็น",
        "ระเบียงส่วนตัว",
        "อนุญาตให้เลี้ยงสัตว์"
      ]
    },
    rules: {
      pets: "อนุญาตให้เลี้ยงสัตว์เล็กได้ (โปรดสอบถามรายละเอียดเงื่อนไขเพิ่มเติมจากทางหอพัก)"
    },
    contact: {
      line: "@DormSpaceMJU",
      phone: "081-758-6897",
      email: "DormSpace.official@mju.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm04)
     ===================================================== */
  const appointmentForm04 = document.getElementById("appointmentForm04");
  if (appointmentForm04) {
    appointmentForm04.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm04.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate04").value;
      const time = document.getElementById("apptTime04").value;
      const phone = document.getElementById("apptPhone04").value;
      const line = document.getElementById("apptLine04").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData04[0].id,
        dorm_name: dormsData04[0].name,
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
        appointmentForm04.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm04) - หน้าหอพัก
     ===================================================== */
  const bookingForm04 = document.getElementById("bookingForm04");
  if (bookingForm04) {
    bookingForm04.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType04");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 3600)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "3600";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate04"
      const moveDateInput = document.getElementById("bookMoveDate04");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData04[0] ? dormsData04[0].id : 'dorm_04',
        dorm_name: dormsData04[0] ? dormsData04[0].name : '2B Place',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }