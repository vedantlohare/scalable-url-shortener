const express = require('express');

require('./src/config/redis');
require('dotenv').config();
const urlRoutes = require('./src/routes/urlRoutes');
const authRoutes = require('./src/routes/authRoutes');
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/', urlRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
