document.addEventListener("DOMContentLoaded", function () {
    const navHTML = `
      <nav>
        <a href="/index.html">Home</a>
        <a href="/pages/grade9.html">Grade 9</a>
        <a href="/pages/grade10.html">Grade 10</a>
        <a href="/pages/grade11.html">Grade 11</a>
        <a href="/pages/grade12.html">Grade 12</a>
        <a href="/pages/program.html">Program of Studies</a>
      </nav>
    `;

    document.getElementById("navbar").innerHTML = navHTML;
});