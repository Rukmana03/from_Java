const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Middleware untuk parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware untuk sesi
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Serve file statis
app.use(express.static(path.join(__dirname, "public")));

// Route untuk menampilkan form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route untuk menangani form submit
app.post("/submit", (req, res) => {
  const { name, email, phone, address, country, card_number, security_code, name_on_card } = req.body;
  let errors = {};

  // 🔹 **Validasi**
  if (!name || name.length < 10) errors.name = "Name must be at least 10 characters.";
  if (!email || !email.includes("@")) errors.email = "Invalid email format.";
  if (!phone || phone.length < 11 || isNaN(phone)) errors.phone = "Phone must be at least 11 digits.";
  if (address && address.length > 500) errors.address = "Address must be less than 500 characters.";
  if (!country) errors.country = "Country is required.";
  if (!card_number) errors.card_number = "Card number is required.";

  // Jika ada error, simpan di session
  if (Object.keys(errors).length > 0) {
    req.session.errors = errors;
    return res.json({ success: false, errors });
  }

  // Jika sukses, kosongkan session error
  req.session.errors = null;
  return res.json({ success: true, message: "Form submitted successfully!" });
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
