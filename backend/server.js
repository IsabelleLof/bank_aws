// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";

// const app = express();
// const PORT = 4001;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// //
// // Generera engångslösenord
// function generateOTP() {
//   // Generera en sexsiffrig numerisk OTP
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   return otp.toString();
// }

// // Din kod här. Skriv dina arrayer
// const users = [];
// const accounts = [];
// const sessions = [];

// // Din kod här. Skriv dina routes:
// let nextUserId = 101;
// let nextAccountId = 1;

// app.post("/users", (req, res) => {

//   const { username, password } = req.body;
//    const newUser = { id: nextUserId++, username, password };
//    const newAccount = { id: nextAccountId++, userId: newUser.id, amount: 0 };

//    // Add the new user to the users array
//    users.push(newUser);
//    accounts.push(newAccount)

//    return res.status(201).json({ user: newUser, account: newAccount });
//   });

//   // Logga in och skapa en sessions-token
// app.post("/sessions", (req, res) => {
//   const { username, password } = req.body;

//   // Find the user with the given username and password
//   const user = users.find((u) => u.username === username && u.password === password);

//   if (!user) {
//     return res.status(401).json({ error: "Fel användarnamn eller lösenord." });
//   }

//   // Generate OTP using the existing function
//   const otp = generateOTP();

//   // Create a new session
//   const session = { userId: user.id, token: otp };
//   sessions.push(session);

//   console.log("Session:", session);

//   return res.status(200).json({ session });
// });

// app.post("/me/accounts", (req, res) => {
//   const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
//   console.log("Received token:", token);
//   const session = sessions.find((session) => session.token === token);
//   console.log("Sessions array:", sessions);
//   if (session) {
//     const userId = session.userId;
//     const account = accounts.find((acc) => acc.userId === userId);
//     if (account) {
//       res.json({ balance: account.amount });
//     } else {
//       res.status(404).json({ error: "Account not found" });
//     }
//   } else {
//     res.status(401).json({ error: "Invalid session token" });
//   }
// });

// function validateOTP(otp) {
//   // Check if the provided OTP matches any of the stored OTPs
//   return sessions.some((session) => session.token === otp);
// }

// app.post("/me/accounts/transactions", (req, res) => {
//   const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
//   const session = sessions.find((session) => session.token === token);
//   if (session) {
//     const userId = session.userId;
//     const amount = req.body.amount;
//     const account = accounts.find((acc) => acc.userId === userId);
//     if (account) {
//       // Update the account balance
//       account.amount += amount;
//       res.json({ newBalance: account.amount });
//     } else {
//       res.status(404).json({ error: "Account not found" });
//     }
//   } else {
//     res.status(401).json({ error: "Invalid session token" });
//   }
// });

// // Starta servern
// app.listen(PORT, () => {
//   console.log(`Bankens backend körs på http://localhost:${PORT}`);
// });

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 4001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
//
// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Din kod här. Skriv dina arrayer
const users = [];
const accounts = [];
const sessions = [];

// Din kod här. Skriv dina routes:
let nextUserId = 101;
let nextAccountId = 1;

app.post("/users", (req, res) => {
  const { username, password } = req.body;
  const newUser = { id: nextUserId++, username, password };
  const newAccount = { id: nextAccountId++, userId: newUser.id, amount: 0 };

  // Add the new user to the users array
  users.push(newUser);
  accounts.push(newAccount);

  return res.status(201).json({ user: newUser, account: newAccount });
});

// Logga in och skapa en sessions-token
app.post("/sessions", (req, res) => {
  const { username, password } = req.body;

  // Find the user with the given username and password
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Fel användarnamn eller lösenord." });
  }

  // Generate OTP using the existing function
  const otp = generateOTP();

  // Create a new session
  const session = { userId: user.id, token: otp };
  sessions.push(session);

  console.log("Session:", session);
  //console.log("new user:", newUser);

  return res.status(200).json({ session });
});

app.post("/me/accounts", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  console.log("Received token:", token);
  const session = sessions.find((session) => session.token === token);
  console.log("Sessions array:", sessions);
  if (session) {
    const userId = session.userId;
    const account = accounts.find((acc) => acc.userId === userId);
    if (account) {
      res.json({ balance: account.amount });
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  } else {
    res.status(401).json({ error: "Invalid session token" });
  }
});

function validateOTP(otp) {
  // Check if the provided OTP matches any of the stored OTPs
  return sessions.some((session) => session.token === otp);
}

app.post("/me/accounts/transactions", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  const session = sessions.find((session) => session.token === token);
  if (session) {
    const userId = session.userId;
    const amount = req.body.amount;
    const account = accounts.find((acc) => acc.userId === userId);
    if (account) {
      // Update the account balance
      account.amount += amount;
      res.json({ newBalance: account.amount });
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  } else {
    res.status(401).json({ error: "Invalid session token" });
  }
});

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
