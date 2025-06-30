const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for your specific clients
const corsOptions = {
    origin: [
        'https://giladmeirson.github.io',
        'file://',
        'null' // This handles file:// protocol requests
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());


// Initialize data array
let database={
    timestamp: new Date().toISOString(),
    shift:[],
    soldiersHere:[],
    tasks:[],
}

// POST endpoint to add data
app.post('/api/data', (req, res) => {
    //console.log('Received POST request with body:', req.body);
    try {
        const newData = req.body;
        
        database.timestamp = new Date().toISOString();
        database.shift = newData.shifts || [];
        database.soldiersHere = newData.soldiersHere || [];
        database.tasks = newData.tasks || [];

        
        res.status(201).json({
            success: true,
            message: 'Data added successfully',
            data: database
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding data',
            error: error.message
        });
    }
});

// GET endpoint to retrieve all data
app.get('/api/data', (req, res) => {
    try {
        res.json({
            success: true,
            data: database
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving data',
            error: error.message
        });
    }
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  POST   /api/data      - Add new data`);
    console.log(`  GET    /api/data      - Get all data`);
    console.log(`  GET    /api/data/:id  - Get data by ID`);
    console.log(`  DELETE /api/data/:id  - Delete data by ID`);
    console.log(`  GET    /api/health    - Health check`);
});