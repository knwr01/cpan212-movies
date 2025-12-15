const btn = document.getElementById("deleteBtn");

if (btn) {
  btn.addEventListener("click", async () => {
    const id = btn.dataset.id;

    if (!confirm("Delete this movie?")) return;

    const res = await fetch(`/movies/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.ok) {
      window.location.href = "/movies";
    } else {
      alert("Delete failed");
    }
  });
}