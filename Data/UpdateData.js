const { connectDB } = require('../Connect/Connect');

// // Connect to the database
const db = connectDB();

const updateData = async (req, res) => {
    const { ia1, ia2, ia3, subj, usn } = req.body;
    

    try {
        // Construct SQL query to update data
        const query = `
        insert into ${subj}_marks(usn,ia1,ia2,ia3) 
        select d.usn, ?,?,? from details d 
        where d.usn=? on duplicate key update ia1=?,ia2=?,ia3=?`;

        // Execute the query
        await db.query(query, [ia1,ia2,ia3,usn,ia1,ia2,ia3]);

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


