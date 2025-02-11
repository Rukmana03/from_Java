document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Mencegah form berpindah halaman

        const formData = new FormData(form);

        const response = await fetch("/submit", {
            method: "POST",
            body: new URLSearchParams(formData),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const result = await response.json(); // Parse JSON response

        if (result.success) {
            alert(result.message); // ✅ Tampilkan alert jika sukses
            form.reset(); // ✅ Kosongkan form setelah sukses
            document.querySelectorAll(".error").forEach(el => el.textContent = ""); // Bersihkan error
        } else {
            // ✅ Jika gagal, tampilkan pesan error di bawah input
            document.querySelectorAll(".error").forEach(el => el.textContent = ""); // Hapus error lama
            Object.keys(result.errors).forEach((key) => {
                const errorElement = document.getElementById(`error-${key}`);
                if (errorElement) {
                    errorElement.textContent = result.errors[key];
                }
            });
        }
    });
});
