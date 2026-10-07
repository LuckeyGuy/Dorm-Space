const dormsData07 = [
  {
    id: "dorm_07",
    name: "ชาร์ลมิสเชล แมนชั่น",
    zone: ["zone-ling"],
    priceFan: 2500,
    priceAir: 2800,
    distance: "1.4 กม. จาก ม.แม่โจ้",
    address: "ซอย 23 ตำบลป่าไผ่ อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1887.4966953911983!2d99.0258454338684!3d18.887374383802868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da23fedd651993%3A0x968575508d605254!2z4LiK4Liy4Lij4LmM4Lil4Lih4Li04Liq4LmA4LiK4LilIOC5geC4oeC4meC4iuC4seC5iOC4mQ!5e0!3m2!1sth!2sth!4v1791193740644!5m2!1sth!2sth",
    images: [
      "../assets/image/07_1.jpg",
      "../assets/image/07_2.jpg",
      "../assets/image/07_3.jpg",
      "../assets/image/07_4.jpg"
    ],
    utilities: {
      electricity: "7 บาท/หน่วย",
      water: "100 บาท/เดือน",
      deposit: "1,000 บาท",
      advance: "จ่ายล่วงหน้า 1 เดือน เข้าอยู่ได้เลย"
    },
    amenities: {
      inRoom: [
        "เครื่องปรับอากาศ / พัดลม",
        "เฟอร์นิเจอร์ครบชุด (เตียงนอน, ตู้เสื้อผ้า, โต๊ะทำงาน)",
        "เครื่องทำน้ำอุ่น",
        "อินเทอร์เน็ตไร้สาย (WiFi) และเคเบิลทีวี / ดาวเทียม"
      ],
      public: [
        "ที่จอดรถกว้างขวาง",
        "กล้องวงจรปิด (CCTV) และระบบคีย์การ์ด",
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
      pets: "ไม่อนุญาตให้เลี้ยงสัตว์ทุกชนิด"
    },
    contact: {
      line: "@DormSpaceMJU",
      phone: "085-524-1888",
      email: "contact@charlesmichelle.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm07)
     ===================================================== */
  const appointmentForm07 = document.getElementById("appointmentForm07");
  if (appointmentForm07) {
    appointmentForm07.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm07.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate07").value;
      const time = document.getElementById("apptTime07").value;
      const phone = document.getElementById("apptPhone07").value;
      const line = document.getElementById("apptLine07").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData07[0].id,
        dorm_name: dormsData07[0].name,
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
        appointmentForm07.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm07) - หน้าหอพัก
     ===================================================== */
  const bookingForm07 = document.getElementById("bookingForm07");
  if (bookingForm07) {
    bookingForm07.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType07");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 2500)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "2500";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate07"
      const moveDateInput = document.getElementById("bookMoveDate07");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData07[0] ? dormsData07[0].id : 'dorm_07',
        dorm_name: dormsData07[0] ? dormsData07[0].name : 'ชาร์ลมิสเชล แมนชั่น',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }