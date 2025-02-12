const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE_PATH = "formData.json";

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "from.html"));
});

app.post("/save-form", (req, res) => {
  const formData = req.body;

  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(formData, null, 2));
    console.log("Form berhasil disimpan!");
    res.json({ success: true, message: "Form berhasil disimpan!" });
  } catch (err) {
    console.error("Gagal menyimpan form", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan form" });
  }
});

app.get("/get-form", (req, res) => {
  if (!fs.existsSync(FILE_PATH)) {
    return res.json({});
  }

  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Gagal membaca file:", err);
    res.status(500).json({ success: false, message: "Gagal membaca data" });
  }
});

app.delete("/delete-form", (req, res) => {
    fs.writeFile("formData.json", JSON.stringify({}, null, 2), (err) => {
        if (err) {
            console.error("Gagal menghapus form:", err);
            return res.status(500).json({ success: false, message: "Gagal menghapus form" });
        }
        console.log("Form berhasil dihapus!");
        res.json({ success: true, message: "Form berhasil dihapus" });
    });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
