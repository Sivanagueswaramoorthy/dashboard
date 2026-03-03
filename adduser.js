const mysql = require('mysql2');

// 1. Connect to your live Cloud Database
const db = mysql.createConnection({
    host: 'mysql-32a5e69e-sivanagu7771-74ba.d.aivencloud.com',
    port: 17949,           
    user: 'avnadmin',         
    password: 'AVNS_x5GIyjOoanVqXlKMi0w',         
    database: 'defaultdb',
    multipleStatements: true, 
    ssl: { rejectUnauthorized: false } 
});

db.connect((err) => {
    if (err) {
        console.error('Failed to connect:', err.stack);
        return;
    }
    console.log('Connected to Cloud Database! Refreshing tables and adding students...');

    // 2. Your exact SQL code!
    const mySQLScript = `
        -- The "Magic Eraser": Safely delete old tables to clear previous mistakes
        DROP TABLE IF EXISTS student_courses;
        DROP TABLE IF EXISTS student_profile;

        -- Create the parent table: student_profile
        CREATE TABLE student_profile (
            email VARCHAR(255) PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            cgpa DECIMAL(3,2),
            activity_points INT,
            reward_points INT
        );

        -- Create the child table: student_courses
        CREATE TABLE student_courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_email VARCHAR(255),
            course_code VARCHAR(50),
            course_name VARCHAR(255),
            attendance_percentage DECIMAL(5,2),
            grade VARCHAR(5),
            FOREIGN KEY (student_email) REFERENCES student_profile(email)
        );

        -- ==========================================
        -- STUDENT 1 DATA (Your Main Email)
        -- ==========================================
        INSERT INTO student_profile (email, full_name, cgpa, activity_points, reward_points) 
        VALUES ('sivanagu7771@gmail.com', 'Sivanagu', 3.85, 120, 450);

        INSERT INTO student_courses (student_email, course_code, course_name, attendance_percentage, grade) VALUES 
        ('sivanagu7771@gmail.com', 'CS401', 'Advanced Web Architecture', 92.50, 'A'),
        ('sivanagu7771@gmail.com', 'DB305', 'Database Management', 88.00, 'B+'),
        ('sivanagu7771@gmail.com', 'AI502', 'Artificial Intelligence', 96.50, 'A'),
        ('sivanagu7771@gmail.com', 'ENG210', 'Technical Writing', 82.00, 'B');

        -- ==========================================
        -- STUDENT 2 DATA (Your Test/Backup Email)
        -- ==========================================
        INSERT INTO student_profile (email, full_name, cgpa, activity_points, reward_points) 
        VALUES ('sivagokulc18@gmail.com', 'Siv Gokul C', 3.85, 120, 450);

        INSERT INTO student_courses (student_email, course_code, course_name, attendance_percentage, grade) VALUES 
        ('sivagokulc18@gmail.com', 'CS401', 'Web technology', 92.50, 'A'),
        ('sivagokulc18@gmail.com', 'DB305', 'Database Management', 88.00, 'B+'),
        ('sivagokulc18@gmail.com', 'AI502', 'Artificial Intelligence', 96.50, 'A'),
        ('sivagokulc18@gmail.com', 'ENG210', 'Technical Writing', 82.00, 'B');
                INSERT INTO student_profile (email, full_name, cgpa, activity_points, reward_points) 
VALUES ('kvabhinanthan@gmail.com', 'Abhinanthan K V', 3.85, 120, 450);

INSERT INTO student_courses (student_email, course_code, course_name, attendance_percentage, grade) VALUES 
('kvabhinanthan@gmail.com', 'CS401', 'Web technology', 45, 'UA'),
('kvabhinanthan@gmail.com', 'DB305', 'Database Management', 88.00, 'B+'),
('kvabhinanthan@gmail.com', 'AI502', 'Artificial Intelligence', 96.50, 'A'),
('kvabhinanthan@gmail.com', 'ENG210', 'Technical Writing', 82.00, 'B');
    `;

    db.query(mySQLScript, (err, results) => {
        if (err) {
            console.error("Error adding students:", err.message);
        } else {
            console.log("SUCCESS! Database refreshed. Both emails can now log in!");
        }
        process.exit();
    });

});
