const { connectDB } = require('../Connect/Connect');

// Connect to the database
const db = connectDB();

const signIn = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);

    const sql = 'SELECT subjCode, name, email, password FROM login WHERE email = ?';

    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ success: false, message: 'An error occurred' });
        } else {
            if (data.length === 0) {
                // No user found with the provided email
                return res.status(404).json({ success: false, message: 'User not found' });
            } else {
                const user = data[0];
                if (user.password !== password) {
                    // Password does not match
                    return res.status(401).json({ success: false, message: 'Incorrect password' });
                } else {
                    // Password matches, return user data without the password
                    delete user.password;
                    return res.status(200).json({ success: true, message: 'Authentication successful', user });
                }
            }
        }
    });
};

module.exports = {
    signIn
};
