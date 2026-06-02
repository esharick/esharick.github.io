document.addEventListener("DOMContentLoaded", function () {
    const navHTML = `
      <nav>
        <a href="/index.html">Home</a>
        <a href="/pages/program.html">Program of Studies</a>
        <a href="/pages/grade9.html">Grade 9</a>
        <a href="/pages/grade10.html">Grade 10</a>
        <a href="/pages/grade11.html">Grade 11</a>
        <a href="/pages/grade12.html">Grade 12</a>
        <a href="/pages/schedule_viewer.html">View Schedule</a>
      </nav>
    `;

    document.getElementById("navbar").innerHTML = navHTML;

    
  // Highlight current page
  const links = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname;

  links.forEach(link => {
      if (currentPath.includes(link.getAttribute("href"))) {
        link.classList.add("active");
    }
  });

});