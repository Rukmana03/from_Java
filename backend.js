const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const e = require('cors');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

let employees = [];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/employees", (req, res) => {
    res.sendFile(path.join(__dirname, "employees.html"));
});

app.get('/api/employees', (req, res) => {
    res.json(employees);
});

// app.get('/session', (req, res) => {
//     if (req.session.user) {
//         res.json(req.session.user);
//     } else {
//         res.json({ message: "Tidak ada data dalam session" });
//     }
// });

app.post('/register', (req, res) => {
    console.log("Data diterima di backend:", req.body);
    
    const { detail, delivery, card_detail } = req.body;

    let errors = [];

    // Validasi Detail
    if (detail.name.length < 10) {
        errors.push("Nama harus minimal 10 karakter!");
    }
    if (!detail.email.includes('@')) {
        errors.push("Email harus format yang valid!");
    }
    if (detail.phone.length < 11 || isNaN(detail.phone)) {
        errors.push("Nomor telepon harus minimal 11 digit dan berupa angka!");
    }

    // Validasi Delivery
    if (delivery.address.length > 500) {
        errors.push("Alamat tidak boleh lebih dari 500 karakter!");
    }
    if (!delivery.country) {
        errors.push("Negara harus dipilih!");
    }

    // Validasi Card Details
    if (!card_detail.card_number) {
        errors.push("Nomor kartu harus diisi!");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(", "), status: 'error' });
    }

    const newEmployee = {
        id: employees.length + 1,
        name: detail.name,
        email: detail.email,
        phone: detail.phone
    };
    employees.push(newEmployee);

    res.status(200).json({ message: "Registrasi berhasil!", status: 'success' });
});

app.put('/api/employees/:id', (req, res) => {
    const {id} = req.params;
    const {name, email, phone} = req.body;

    const employee = employees.find(emp => emp.id == id);
    
    if (!employee) {
        return res.status(404).json({message: "Data tidak ditemukan!"});
    }

    employee.name = name;
    employee.email = email;
    employee.phone = phone;

    res.json({ message: "Data berhasil diperbarui!"}); 
});

app.delete('/api/employees/:id', (req, res) => {
    const {id} = req.params;
    employees = employees.filter(emp => emp.id !=id);
    res.json({message: "Data berhasil dihapus!"});
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
