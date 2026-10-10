const dormsData10 = [
  {
    id: "dorm_10",
    name: "สุธาศินีเพลส",
    zone: ["zone-ling"],
    priceFan: 3000,
    priceAir: 3500,
    distance: "1.5 กม. จาก ม.แม่โจ้",
    address: "ซอยหลิ่งมื่น 23 ถนนหลิ่งมื่น ตำบลป่าไผ่ อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.0269265704505!2d99.02511500000001!3d18.8858866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da234546306ac3%3A0xb154c056e7c57d7b!2z4Lir4Lit4Lie4Lix4LiB4Liq4Li44LiY4Liy4Lio4Li04LiZ4Li1IOC5gOC4nuC4peC4qg!5e0!3m2!1sth!2sth!4v1791195707023!5m2!1sth!2sth",
    images: [
      "../assets/image/10_1.jpg",
      "../assets/image/10_2.jpg",
      "../assets/image/10_3.jpg",
      "../assets/image/10_4.jpg"
    ],
    utilities: {
      electricity: "สอบถามหอพัก",
      water: "ฟรีค่าน้ำ",
      deposit: "1 เดือน",
      advance: "จ่ายล่วงหน้า 1 เดือน เข้าอยู่ได้เลย"
    },
    amenities: {
      inRoom: [
        "ฟรีตู้เย็น & เคเบิลทีวี & อินเทอร์เน็ต WiFi",
        "เครื่องปรับอากาศ / พัดลม",
        "เตียงนอนขนาด 6 ฟุต พร้อมที่นอน",
        "โต๊ะวางทีวี, โต๊ะหนังสือ, โต๊ะเครื่องแป้ง, ตู้เสื้อผ้า และเครื่องทำน้ำอุ่น"
      ],
      public: [
        "เข้า-ออกด้วยระบบคีย์การ์ด / สแกนลายนิ้วมือ",
        "กล้องวงจรปิด CCTV มากถึง 32 ตัว",
        "มีแม่บ้านดูแลทำความสะอาดประจำหอพัก",
        "ตู้น้ำดื่มหยอดเหรียญ & ที่จอดรถสะดวกสบาย"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "พัดลม",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "ตู้เย็น",
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
      phone: "096-959-9166",
      email: "contact@suthasiniplace.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm10)
     ===================================================== */
  const appointmentForm10 = document.getElementById("appointmentForm10");
  if (appointmentForm10) {
    appointmentForm10.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm10.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate10").value;
      const time = document.getElementById("apptTime10").value;
      const phone = document.getElementById("apptPhone10").value;
      const line = document.getElementById("apptLine10").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData10[0].id,
        dorm_name: dormsData10[0].name,
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
        appointmentForm10.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm10) - หน้าหอพัก
     ===================================================== */
  const bookingForm10 = document.getElementById("bookingForm10");
  if (bookingForm10) {
    bookingForm10.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType10");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 3000)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "3000";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate10"
      const moveDateInput = document.getElementById("bookMoveDate10");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData10[0] ? dormsData10[0].id : 'dorm_10',
        dorm_name: dormsData10[0] ? dormsData10[0].name : 'สุธาศินีเพลส',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }