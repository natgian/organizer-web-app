const agreeBtn = document.querySelector(".agree-btn");
const cookieBanner = document.getElementById("cookies");

setAgreedCookie = (cookieName, cookieValue, expirationDays) => {
  let date = new Date();
  date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + "; " + expires + "; path=/";
};

getAgreedCookie = (cookieName) => {
  const name = cookieName + "=";
  const cookieDecoded = decodeURIComponent(document.cookie);
  const cookieArray = cookieDecoded.split("; ");
  let value;
  cookieArray.forEach(val => {
    if(val.indexOf(name) === 0) value = val.substring(name.length);
  });

  return value;
};

agreeBtn.addEventListener("click", () => {
  cookieBanner.style.display = "none";
  setAgreedCookie("agreedCookie", true, 30);
});

cookieMessage = () => {
  if(!getAgreedCookie("agreedCookie")) {
    cookieBanner.style.display = "block";
  }
};

window.addEventListener("load", cookieMessage);


