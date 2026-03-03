const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Google Auth Configuration
const CLIENT_ID = "318717217301-kot0gq3l7amhtfphhvsbjh4ehau9heb4.apps.googleusercontent.com";
const googleClient = new OAuth2Client(CLIENT_ID);

// 2. Database Connection (Port 3307 for your specific XAMPP)
// 2. Cloud Database Connection
const db = mysql.createConnection({
    host: 'mysql-32a5e69e-sivanagu7771-74ba.d.aivencloud.com',
    port: 17949,           
    user: 'avnadmin',         
    password: 'AVNS_x5GIyjOoanVqXlKMi0w',         
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false } 
});

db.connect((err) => {
    if (err) console.error('Database connection failed:', err.stack);
    else console.log('Connected to SQL database on port 3307.');
});

// 3. The Secure API Route
app.post('/api/get-dashboard-data', async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google Token securely
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const userEmail = payload.email; 

        // Database Queries tailored to the logged-in email
        const profileQuery = "SELECT * FROM student_profile WHERE email = ?";
        const coursesQuery = "SELECT * FROM student_courses WHERE student_email = ?";

        // Get Profile Data
        db.query(profileQuery, [userEmail], (err, profileResults) => {
            if (err) return res.status(500).json({ success: false, message: "DB Error" });
            if (profileResults.length === 0) return res.status(404).json({ success: false, message: "Student not found in the university database." });

            // Get Course Data
            db.query(coursesQuery, [userEmail], (err, courseResults) => {
                if (err) return res.status(500).json({ success: false, message: "DB Error" });

                // Send the tailored data back to the frontend
                res.json({ 
                    success: true, 
                    profile: profileResults[0],  
                    courses: courseResults,      
                    picture: payload.picture     
                });
            });
        });

    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid Google Token" });
    }
});

app.listen(3000, () => console.log('Backend server running on http://localhost:3000'));