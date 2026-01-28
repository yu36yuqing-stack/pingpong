
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/scan', scanRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
