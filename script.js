const carousel = document.querySelector(".carousel"),
      arrowIcons = document.querySelectorAll(".wrapper i"),
      cards = carousel.querySelectorAll(".card");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

const isMobile = () => window.innerWidth <= 600; // ฟังก์ชันตรวจสอบโหมดมือถือ

const getCardWidth = () => {
    return cards[0].clientWidth + 20; // ขนาดการ์ด + margin
}

const getGroupWidth = () => {
    if (isMobile()) {
        return getCardWidth(); // โหมดมือถือ เลื่อนทีละการ์ด
    } else {
        const cardWidth = getCardWidth();
        return cardWidth * 2; // ในโหมดปกติเลื่อนทีละ 2 การ์ด
    }
}

const showHideIcons = () => {
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    arrowIcons[0].style.display = carousel.scrollLeft === 0 ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft >= scrollWidth ? "none" : "block";
}

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        const groupWidth = getGroupWidth(); // คำนวณขนาดที่ต้องเลื่อน
        carousel.scrollLeft += icon.id === "left" ? -groupWidth : groupWidth;
        setTimeout(() => showHideIcons(), 60);
    });
});

const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
}

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");
    isDragging = false;

    if (isMobile()) {
        // สำหรับโหมดมือถือ: เลื่อนไปที่การ์ดที่ใกล้ที่สุด
        const cardWidth = getCardWidth();
        const scrollDiff = carousel.scrollLeft % cardWidth;
        if (scrollDiff !== 0) {
            carousel.scrollLeft += (scrollDiff > cardWidth / 2) ? (cardWidth - scrollDiff) : -scrollDiff;
        }
    }
    showHideIcons();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);
