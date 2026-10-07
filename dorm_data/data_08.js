const dormsData08 = [
  {
    id: "dorm_08",
    name: "มายเฮาส์ 1 @แม่โจ้",
    zone: ["zone-front"],
    priceFan: 3800,
    priceAir: 3800,
    distance: "1.2 กม. จาก ม.แม่โจ้",
    address: "297 ตำบลหนองจ๊อม อำเภอสันทราย จังหวัดเชียงใหม่ 50290",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.0489971005663!2d99.02012189999999!3d18.8849074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da2351deaf31dd%3A0xbcbb5cd36f326b1b!2sMy%20house%20apartment!5e0!3m2!1sth!2sth!4v1791194506194!5m2!1sth!2sth",
    images: [
      "../assets/image/08_1.jpg",
      "../assets/image/08_2.jpg",
      "../assets/image/08_3.jpg",
      "../assets/image/08_4.jpg"
    ],
    utilities: {
      electricity: "8 บาท/หน่วย",
      water: "150 บาท/เดือน",
      deposit: "1,000 บาท",
      advance: "สัญญา 1 ปี (เช่าตู้เย็นเพิ่ม 250 บาท/เดือน)"
    },
    amenities: {
      inRoom: [
        "ห้องขนาด 25 ตรม. พร้อมระเบียงส่วนตัว",
        "เฟอร์นิเจอร์",
        "TV LED 32 นิ้ว, เครื่องทำน้ำอุ่น, เครื่องปรับอากาศ 12,000 BTU",
        "ผ้าม่านหนากันแดด กัน UV"
      ],
      public: [
        "ที่จอดรถยนต์และมอเตอร์ไซค์จำนวนมาก",
        "กล้องวงจรปิด (CCTV) มากถึง 48 ตัว และประตู Keycard",
        "อินเทอร์เน็ตไร้สาย (WiFi) ความเร็วสูง",
        "ตู้น้ำดื่มแบบหยอดเหรียญ และเครื่องซักผ้าหยอดเหรียญ"
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
      phone: "085-868-2525 (สำรอง: 081-472-0221)",
      email: "contact@myhousemju.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm08)
     ===================================================== */
  const appointmentForm08 = document.getElementById("appointmentForm08");
  if (appointmentForm08) {
    appointmentForm08.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm08.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate08").value;
      const time = document.getElementById("apptTime08").value;
      const phone = document.getElementById("apptPhone08").value;
      const line = document.getElementById("apptLine08").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData08[0].id,
        dorm_name: dormsData08[0].name,
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
        appointmentForm08.reset();
        location.reload();
      }
    });
  }

  /* =====================================================
     จัดการฟอร์มขอจองห้องพัก (bookingForm08) - หน้าหอพัก
     ===================================================== */
  const bookingForm08 = document.getElementById("bookingForm08");
  if (bookingForm08) {
    bookingForm08.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
        window.location.href = "../auth.html";
        return;
      }

      // 1. ดึงประเภทห้องพักที่เลือก
      const roomTypeSelect = document.getElementById("bookRoomType08");
      if (!roomTypeSelect || !roomTypeSelect.value) {
        alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
        return;
      }
      const roomType = roomTypeSelect.value;
      
      // ดึงค่ามัดจำจาก attribute ของ option ที่เลือก (อิงราคาเริ่มต้น 3800)
      const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
      const depositVal = selectedOption.getAttribute("data-price") || "3800";

      // 2. ดึงค่าวันที่ต้องการย้ายเข้าอยู่จาก input id="bookMoveDate08"
      const moveDateInput = document.getElementById("bookMoveDate08");
      const moveDate = moveDateInput ? moveDateInput.value : '';

      if (!moveDate) {
        alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
        return;
      }

      // 3. แพ็คข้อมูลทั้งหมดใส่ URL เพื่อ Navigation ไปหน้า booking.html
      const queryParams = new URLSearchParams({
        dorm_id: dormsData08[0] ? dormsData08[0].id : 'dorm_08',
        dorm_name: dormsData08[0] ? dormsData08[0].name : 'มายเฮาส์ 1 @แม่โจ้',
        room_type: roomType,
        move_date: moveDate,
        deposit: depositVal
      });

      // เด้งไปหน้า booking.html
      window.location.href = `../booking.html?${queryParams.toString()}`;
    });
  }