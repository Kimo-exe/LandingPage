const fetch = (...args) => 
  import('node-fetch').then(({default: fetch}) => fetch(...args));

const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve HTML folder
app.use(express.static(__dirname));

// ✅ Root route – serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html',
    'index.html'));
});

// ✅ MongoDB connectie
mongoose.connect('mongodb://localhost:27017/Fanvest')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Schema
const responseSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  birthYear: Date,
  location: String,
  occupation: String,
  function: String,
  question1: String,
  question2: String,
  question3: String,
  question4: String,
  question5: String,
  question6: String,
  question7: String,
}, { timestamps: true });

const Response = mongoose.model('Response', responseSchema, 'test_phase_landingPageQuestions');

// ✅ Automail functie
async function sendThankYouEmail(toEmail, firstName) {
  console.log("📧 sendThankYouEmail() is gestart!");
  console.log("📬 Email voorbereiden voor:", toEmail);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fanvest.platform@gmail.com',
      pass: 'eatcoxhrvpfirfac'   // <-- GEEN SPATIES!!
    }
  });

  const mailOptions = {
    from: '"Fanvest" <fanvest.platform@gmail.com>',
    to: toEmail,
    subject: 'Bedankt voor uw deelname!',
    html: `
      <h2>Beste ${firstName},</h2>
      <p>Hartelijk dank voor uw deelname aan de Fanvest-enquête.</p>
      <p>
      Uw input is voor ons van grote waarde en helpt ons om Fanvest verder te ontwikkelen tot een platform dat écht aansluit bij de behoeften van zowel fans als creators. Op basis van de verzamelde gegevens zullen wij ons model optimaliseren en verder verfijnen.</p>
      <p>U bent momenteel opgenomen in onze early access-lijst. De eerste 50 geselecteerde deelnemers zullen exclusieve toegang krijgen tot Fanvest en automatisch verder op de hoogte gehouden worden van nieuwe ontwikkelingen, updates en lanceringen.</p>
      <p>Wij waarderen uw betrokkenheid en vertrouwen, en kijken ernaar uit om u binnenkort meer te kunnen ontdekken.</p>
      <p>Met vriendelijke groeten, <br/>
      Team Fanvest</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email verzonden:", info.response);
  } catch (err) {
    console.error("❌ Email fout:", err);
  }
}

//google spreadsheet functie
async function sendToGoogleSheet(data) {
  const webhookUrl = "https://script.google.com/macros/s/AKfycbxfoPnY0hwQVxEJ8UH4oYSoLTJYIkrZTSXxwt7t_J-wsaUxX6nTq7LqEF6670hIRd3q/exec";
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  console.log("✅ Google Sheets response:", await res.text());
}


// ✅ POST ROUTE
app.post('/api/submit', async (req, res) => {

  console.log("📨 POST route: we gaan nu de e-mail proberen te versturen!");

  try {
    console.log("✅ API request ontvangen:", req.body);

    const doc = new Response(req.body);
    await doc.save();

    // versturen naar google spreadsheet
    await sendToGoogleSheet(req.body)

    console.log("📬 Email wordt verstuurd naar:", req.body.email);
    await sendThankYouEmail(req.body.email, req.body.firstName);
    console.log("✅ POST route: sendThankYouEmail() is afgerond!");

    return res.json({ success: true, id: doc._id });

  } catch (err) {
    console.error("❌ Error in POST route:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Server running on http://localhost:3000');
});
