const express = require("express");
const app = express();
app.use(express.json());

// Simpan donasi terakhir di memory
let latestDonation = null;
const SECRET = process.env.SECRET_KEY || "robloxsaweria123";

// Saweria POST ke sini
app.post("/webhook", (req, res) => {
    const body = req.body;

    // Validasi basic: pastikan ada donator_name dan amount_raw
    if (!body || !body.donator_name || !body.amount_raw) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    latestDonation = body;
    console.log(`[Donasi] ${body.donator_name} - Rp${body.amount_raw}`);
    res.sendStatus(200);
});

// Roblox GET dari sini
app.get("/latest", (req, res) => {
    // Cek secret key supaya tidak sembarang orang bisa akses
    if (req.query.secret !== SECRET) {
        return res.status(403).json({ error: "Forbidden" });
    }
    res.json(latestDonation || {});
});

// Health check
app.get("/", (req, res) => {
    res.send("Saweria Webhook Server aktif!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server jalan di port ${PORT}`);
});
