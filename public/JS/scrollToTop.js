const scrollToTop = document.querySelector("#scrollToTopButton");

if (scrollToTop) {
  document.addEventListener("scroll", (e) => {
    if (document.documentElement.scrollTop <= 150) {
      scrollToTop.style.display = "none";
    } else {
      scrollToTop.style.display = "block";
    };
  });
  scrollToTop.addEventListener('click', () => {
    document.body.scrollIntoView({
      behavior: "smooth",
    });
  });
};