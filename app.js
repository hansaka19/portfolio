const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxVideo = document.getElementById("lightboxVideo");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxLeft = document.getElementById("lightboxLeft");
const lightboxRight = document.getElementById("lightboxRight");
const lightboxClose = document.querySelector(".lightbox-close");

const previewImg = document.getElementById("previewImg");
const previewVideo = document.getElementById("previewVideo");
const previewTitle = document.getElementById("previewTitle");
const previewDesc = document.getElementById("previewDesc");
const previewTags = document.getElementById("previewTags");
const previewOpen = document.getElementById("previewOpen");

const workItems = document.querySelectorAll(".work-item");
const albumImages = document.querySelectorAll(".lightbox-trigger");

const clockText = document.getElementById("clockText");
const yearText = document.getElementById("year");

const openLightbox = ({ type, src, title, left, right }) => {
  if (!lightbox) return;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  if (lightboxTitle) lightboxTitle.textContent = title || "";
  if (lightboxLeft) lightboxLeft.textContent = left || "";
  if (lightboxRight) lightboxRight.textContent = right || "";

  if (type === "video") {
    lightboxImg.style.display = "none";
    lightboxVideo.style.display = "block";
    lightboxVideo.src = src;
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.style.display = "none";
    lightboxImg.style.display = "block";
    lightboxImg.src = src;
  }
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxVideo.pause();
};

const setPreviewMedia = ({ image, video, title, desc, tags }) => {
  if (previewTitle) previewTitle.textContent = title || "";
  if (previewDesc) previewDesc.textContent = desc || "";
  if (previewTags) previewTags.textContent = tags || "";

  if (video) {
    previewImg.style.display = "none";
    previewVideo.style.display = "block";
    previewVideo.querySelector("source").src = video;
    previewVideo.load();
  } else {
    previewVideo.pause();
    previewVideo.style.display = "none";
    previewImg.style.display = "block";
    previewImg.src = image;
  }

  if (previewOpen) {
    previewOpen.dataset.image = image || "";
    previewOpen.dataset.video = video || "";
    previewOpen.dataset.caption = title || "";
  }
};

workItems.forEach((item) => {
  const image = item.dataset.image || "";
  const video = item.dataset.video || "";
  const title = item.dataset.title || "";
  const desc = item.dataset.desc || "";
  const tags = item.dataset.tags || "";

  const updatePreview = () => {
    workItems.forEach((el) => el.classList.remove("is-active"));
    item.classList.add("is-active");
    setPreviewMedia({ image, video, title, desc, tags });
  };

  item.addEventListener("mouseenter", updatePreview);
  item.addEventListener("focus", updatePreview);
  item.addEventListener("click", (event) => {
    event.preventDefault();
    openLightbox({
      type: video ? "video" : "image",
      src: video || image,
      title,
      left: desc,
      right: tags,
    });
  });
});

const activeItem = document.querySelector(".work-item.is-active");
if (activeItem) {
  setPreviewMedia({
    image: activeItem.dataset.image || "",
    video: activeItem.dataset.video || "",
    title: activeItem.dataset.title || "",
    desc: activeItem.dataset.desc || "",
    tags: activeItem.dataset.tags || "",
  });
}

albumImages.forEach((img) => {
  img.addEventListener("click", () => {
    openLightbox({
      type: "image",
      src: img.getAttribute("src"),
      title: img.getAttribute("alt"),
      left: "Album preview",
      right: "Open full",
    });
  });
});

if (previewOpen) {
  previewOpen.addEventListener("click", () => {
    const video = previewOpen.dataset.video;
    const image = previewOpen.dataset.image;
    openLightbox({
      type: video ? "video" : "image",
      src: video || image,
      title: previewOpen.dataset.caption || "Preview",
      left: previewDesc ? previewDesc.textContent : "",
      right: previewTags ? previewTags.textContent : "",
    });
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

if (yearText) {
  yearText.textContent = new Date().getFullYear();
}

if (clockText) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  });
  const tick = () => {
    clockText.textContent = formatter.format(new Date());
  };
  tick();
  setInterval(tick, 1000 * 30);
}

const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
