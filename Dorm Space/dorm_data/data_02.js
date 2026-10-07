const dormsData02 = [
  {
    id: "dorm_02",
    name: "นิลกมลแมนชั่น @แม่โจ้",
    zone: ["zone-front"], // โซนประตูหน้ามอ (อิงตามข้อมูลทำเลใกล้ ม.แม่โจ้ 1.5 กม.)
    priceFan: 2470,
    priceAir: 2850,
    distance: "1.5 กม. จาก ม.แม่โจ้",
    address: "ตำบลหนองหาร อำเภอสันทราย จังหวัดเชียงใหม่",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.6478072466803!2d99.0334312!3d18.813842599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da2522cdd4b27d%3A0x3d2878eea95ef210!2z4LiZ4Li04Lil4LiB4Liz4LmB4Lir4LiHIOC5geC4oeC4meC4iuC4seC5iOC4mQ!5e0!3m2!1sth!2sth!4v1791128268632!5m2!1sth!2sth",
    images: [
      "../assets/image/02_1.jpg",
      "../assets/image/02_2.jpg",
      "../assets/image/02_3.jpg",
      "../assets/image/02_4.jpg"
    ],
    utilities: {
      electricity: "7 บาท/หน่วย",
      water: "50 บาท/เดือน",
      deposit: "สอบถามหอพัก",
      advance: "จ่ายล่วงหน้า 1 เดือน เข้าอยู่ได้เลย"
    },
    amenities: {
      inRoom: [
        "เครื่องปรับอากาศ / พัดลม",
        "เฟอร์นิเจอร์ครบชุด (ตู้เสื้อผ้า, เตียงนอน)",
        "เครื่องทำน้ำอุ่น",
        "เคเบิลทีวี / ดาวเทียม"
      ],
      public: [
        "ที่จอดรถกว้างขวาง",
        "ลิฟต์โดยสารภายในอาคาร",
        "กล้องวงจรปิด (CCTV) และประตู Keycard",
        "ร้านซัก-รีด / บริการเครื่องซักผ้าหยอดเหรียญ",
        "โทรศัพท์สายตรง"
      ],
      rawList: [
        "เครื่องปรับอากาศ",
        "พัดลม",
        "เฟอร์นิเจอร์ครบชุด",
        "เครื่องทำน้ำอุ่น",
        "ตู้เย็น",
        "ไมโครเวฟ",
        "ระเบียงส่วนตัว"
      ]
    },
    rules: {
      pets: "โปรดสอบถามข้อกำหนดเพิ่มเติมจากทางหอพัก"
    },
    contact: {
      line: "@DormSpaceMJU",
      phone: "089-791-4664",
      email: "DormSpace.official@mju.com"
    }
  }
];

/* =====================================================
     จัดการฟอร์มนัดหมายดูห้องจริง (appointmentForm02)
     ===================================================== */
  const appointmentForm02 = document.getElementById("appointmentForm02");
  if (appointmentForm02) {
    appointmentForm02.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 🛑 ล็อกปุ่มทันที ป้องกันการกดเบิ้ล (Double Submit)
      const submitBtn = appointmentForm02.querySelector('button[type="submit"]');
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

      const date = document.getElementById("apptDate02").value;
      const time = document.getElementById("apptTime02").value;
      const phone = document.getElementById("apptPhone02").value;
      const line = document.getElementById("apptLine02").value;

      const { error } = await supabaseClient.from("appointments").insert({
        user_id: session.user.id,
        dorm_id: dormsData02[0].id,
        dorm_name: dormsData02[0].name,
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
        appointmentForm02.reset();
        location.reload(); // รีเฟรชหน้าจออัปเดตสถานะทันที
      }
    });
  }

  if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (!session) {
            alert("กรุณาเข้าสู่ระบบก่อนทำรายการจองห้องพักค่ะ ✨");
            window.location.href = "../auth.html";
            return;
          }

          const roomTypeSelect = document.getElementById("bookRoomType");
          const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
          const roomType = selectedOption.value;
          const depositVal = selectedOption.getAttribute("data-price");

          if (!depositVal) {
            alert("กรุณาเลือกประเภทห้องพักก่อนส่งคำขอจองค่ะ ✨");
            return;
          }

          const moveDate = document.getElementById("bookMoveDate").value;
          if (!moveDate) {
            alert("กรุณาเลือกวันที่ต้องการย้ายเข้าอยู่ด้วยค่ะ 📦");
            return;
          }

          // แพ็คข้อมูลส่งไปหน้า booking.html เพื่อเลือกวิธีจ่ายเงินและใส่โค้ดส่วนลด
          const queryParams = new URLSearchParams({
            dorm_id: dorm.id,
            dorm_name: dorm.name,
            room_type: roomType,
            move_date: moveDate,
            deposit: depositVal
          });

          window.location.href = `../booking.html?${queryParams.toString()}`;
        });
      }