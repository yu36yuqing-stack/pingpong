
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const db = require('./utils/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/health', async (req, res) => {
  try {
    if (typeof db.migrate === 'function') {
      // ensure sqlite demo schema exists
      await db.migrate();
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/auth', authRoutes);
app.use('/scan', scanRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

(async () => {
  try {
    if (typeof db.migrate === 'function') {
      await db.migrate();
      console.log('[db] sqlite migrated');
    }
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
})();
