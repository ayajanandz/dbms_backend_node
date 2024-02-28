const { connectDB } = require('../Connect/Connect');

// Connect to the database
const db = connectDB();

const updateData = async (req, res) => {
    const { ia1, ia2, ia3, subj, usn } = req.body;
    // const { usn } = req.params; // Assuming usn is part of URL parameters

    try {
        // Construct SQL query to update data
        const query = `
            UPDATE ${subj}_marks
            SET ia1 = ?,
                ia2 = ?,
                ia3 = ?
            WHERE usn = ?`;

        // Execute the query
        await db.query(query, [ia1, ia2, ia3, usn]);

        // If the execution reaches here, it means the update was successful
        return res.status(200).json({ message: 'Data edited successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    updateData
};
