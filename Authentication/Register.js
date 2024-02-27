
const { connectDB } = require('../Connect/Connect');

const db = connectDB();



const register = async (req, res) => {
  console.log(req.body);

  const { name, email, password, subject } = req.body;

  db.query('SELECT email FROM login WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Error checking for existing user" });
    }

    if (results && results.length > 0) {
      return res.send({ message: "User already exists" });
    }

    // If no error and no existing user found, proceed to insert the new user
    db.query('INSERT INTO login SET ?', { name: name, email: email, password: password, subjCode: subject }, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: "Error registering user" });
      } else {
        return res.send({ message: "Registered successfully" });
      }
    });
  });
};

module.exports = {
    register
}


