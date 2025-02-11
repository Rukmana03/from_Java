const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

// Middleware untuk parsing JSON body
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key', // Gantilah dengan secret key yang aman
  resave: false,
  saveUninitialized: true
}));
// Endpoint untuk mengirimkan file HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint untuk registrasi
app.post('/register', (req, res) => {
    const { name, email, phone, address, country, card_number, security, namecard } = req.body;

    // Validasi input
    if (name.length < 10) {
        return res.status(400).json({ message: "Nama harus minimal 10 karakter!", status: 'error' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ message: "Email harus format yang valid!", status: 'error' });
    }

    if (phone.length < 11 || isNaN(phone)) {
        return res.status(400).json({ message: "Nomor telepon harus minimal 11 digit dan berupa angka!", status: 'error' });
    }

    if (address.length > 500) {
        return res.status(400).json({ message: "Alamat tidak boleh lebih dari 500 karakter!", status: 'error' });
    }

    if (!country) {
        return res.status(400).json({ message: "Negara harus dipilih!", status: 'error' });
    }

    if (!card_number) {
        return res.status(400).json({ message: "Nomor kartu harus diisi!", status: 'error' });
    }

    req.session.user = {
      name,
      email,
      phone,
      address,
      country,
      card_number,
      security,
      namecard
  };
    // Jika semua validasi berhasil
    res.status(200).json({ message: "Registrasi berhasil!", status: 'success' });
});

// Menjalankan server pada port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
