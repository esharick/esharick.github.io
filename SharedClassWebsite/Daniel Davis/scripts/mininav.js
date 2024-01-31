// allow a grace period for the user to move the mouse from the navbar to the mininav
let hoverTimeout;

function expandNavbar() {
  clearTimeout(hoverTimeout);
  document.querySelector("header").style.width = "100%";
  document.querySelector("header nav").style.marginRight = "20px";
}

function collapseNavbar() {
  hoverTimeout = setTimeout(() => {
    document.querySelector("header").style.width = "180px";
    document.querySelector("header nav").style.marginRight = "0";
  }, 1250);
}
