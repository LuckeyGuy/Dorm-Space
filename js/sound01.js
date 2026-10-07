// sound01.js — ระบบเสียงคลิกแบบที่ 1 (click01.mp3)
(() => {
  const audio = new Audio("assets/sound/click01.mp3");
  audio.preload = "auto";
  let isUnlocked = false;

  const playSound = () => {
    try {
      const soundClone = audio.cloneNode();
      soundClone.volume = 0.75;
      const p = soundClone.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } catch (e) {}
  };

  const handlePointerDown = () => {
    if (!isUnlocked) {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        isUnlocked = true;
      }).catch(() => {});
    }
    playSound();
  };

  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
})();