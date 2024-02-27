const { connectDB } = require('../Connect/Connect');

// Connect to the database
const db = connectDB();

const viewData = async () => {
    try {
        // SQL statement to update avg_marks
        const updateAvgMarksQuery = `
            UPDATE dbms_marks 
            SET avg_marks = (ia1 + ia2 + ia3) / 3
            WHERE ia1 IS NOT NULL AND ia2 IS NOT NULL AND ia3 IS NOT NULL;
        `;

        // SQL statements to create views and select data
        const createDaysPresentView = `
            CREATE VIEW IF NOT EXISTS days_present AS
            SELECT name, COUNT(*) AS present
            FROM (SELECT DISTINCT name, date FROM dbms_attendance) AS distinct_name
            GROUP BY name;
        `;

        const createUltimateTableView = `
            CREATE VIEW IF NOT EXISTS ultimate_table AS
            SELECT DISTINCT d.usn, d.name, p.present,
            (SELECT COUNT(DISTINCT date) FROM dbms_attendance) AS total_no_of_days,
            IFNULL(m.ia1, 0) AS ia1,
            IFNULL(m.ia2, 0) AS ia2,
            IFNULL(m.ia3, 0) AS ia3,
            m.avg_marks
            FROM details d
            LEFT JOIN dbms_attendance a ON d.name = a.name
            LEFT JOIN days_present p ON d.name = p.name
            LEFT JOIN dbms_marks m ON d.usn = m.usn;
        `;

        const selectFromUltimateTable = `
            SELECT * FROM ultimate_table;
        `;

        // Execute update query to calculate avg_marks
        await executeQuery(updateAvgMarksQuery, 'Updating avg_marks');

        // Execute SQL statements to create views
        await executeQuery(createDaysPresentView, 'Creating days_present view');
        await executeQuery(createUltimateTableView, 'Creating ultimate_table view');

        // After creating the views, execute the SELECT statement
        const selectResults = await executeQuery(selectFromUltimateTable, 'Selecting from ultimate_table');

        // Return the selected results
        console.table(selectResults);
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        // Close the database connection
        // db.end();
    }
};

async function executeQuery(query, message) {
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error ${message}:`, err);
                reject(err);
            } else {
                console.log(`${message} successfully`);
                resolve(results);
            }
        });
    });
}

module.exports = {
    viewData
};
