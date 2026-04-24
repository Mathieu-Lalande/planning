const express = require('express');
const cors    = require('cors');

const planningsRouter = require('./routes/plannings');
const eventsRouter    = require('./routes/events');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Santé
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Ressources
app.use('/api/plannings',        planningsRouter);
app.use('/api/plannings',        eventsRouter);   // GET/POST /:planningId/events
app.use('/api/events',           eventsRouter);   // PUT/DELETE /:id

app.listen(PORT, () => {
  console.log(`BTV Planning API — http://localhost:${PORT}`);
});
