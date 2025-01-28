document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.getElementById("start-btn").click();
  }
});
document.getElementById("start-btn").addEventListener("click", () => {
  window.location.href = "../exam/exam.html";
});
