const { connectDB } = require('../Connect/Connect');

// Connect to the database
const db = connectDB();

const viewData = async (req, res) => {
    const subj = req.query.subj; 
    console.log("Showing the values for -> ", subj);
    try {
        // SQL statements to drop existing views
        const dropViewsQueries = [
            `DROP VIEW IF EXISTS ${subj}_marks;`,
            `DROP VIEW IF EXISTS days_present;`,
            `DROP VIEW IF EXISTS ultimate_table;`
        ];

        // Execute update queries to drop existing views
        for (const query of dropViewsQueries) {
            await executeQuery(query);
        }

        // SQL statement to update avg_marks
        const updateAvgMarksQuery = `
            UPDATE ${subj}_marks 
            SET avg_marks = (ia1 + ia2 + ia3) / 3
            WHERE ia1 IS NOT NULL AND ia2 IS NOT NULL AND ia3 IS NOT NULL;
        `;

        // SQL statements to create views
        const createDaysPresentView = `
            CREATE VIEW days_present AS
            SELECT name, COUNT(*) AS present
            FROM (SELECT DISTINCT name, date FROM ${subj}_attendance) AS distinct_name
            GROUP BY name;
        `;

        const createUltimateTableView = `
            CREATE VIEW ultimate_table AS
            SELECT DISTINCT d.usn, d.name, p.present,
            (SELECT COUNT(DISTINCT date) FROM ${subj}_attendance) AS total_no_of_days,
            IFNULL(m.ia1, 0) AS ia1,
            IFNULL(m.ia2, 0) AS ia2,
            IFNULL(m.ia3, 0) AS ia3,
            m.avg_marks
            FROM details d
            LEFT JOIN ${subj}_attendance a ON d.name = a.name
            LEFT JOIN days_present p ON d.name = p.name
            LEFT JOIN ${subj}_marks m ON d.usn = m.usn;
        `;

        const selectFromUltimateTable = `
            SELECT * FROM ultimate_table;
        `;

        // Execute update query to calculate avg_marks
        await executeQuery(updateAvgMarksQuery);

        // Execute SQL statements to create views
        await executeQuery(createDaysPresentView);
        await executeQuery(createUltimateTableView);

        // After creating the views, execute the SELECT statement
        const data = await executeQuery(selectFromUltimateTable);

        // Extracting data and formatting it into an array
        const dataArray = data.map(item => ({
            usn: item.usn,
            name: item.name,
            present: item.present,
            total_no_of_days: item.total_no_of_days,
            ia1: item.ia1,
            ia2: item.ia2,
            ia3: item.ia3,
            avg_marks: item.avg_marks
        }));

        console.table(dataArray);
        return res.status(200).json(dataArray);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function executeQuery(query, message) {
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error ${message}:`, err);
                reject(err);
            } else {
                 
                resolve(results);
            }
        });
    });
}

module.exports = {
    viewData
};
