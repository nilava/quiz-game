const axios = require('axios');

const headers = {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pbGF2YSIsInVzZXJJZCI6IjY3NzhkOTZlZWI5MjJiY2U1M2Y3MmQzOSIsImlhdCI6MTczNjUxNTg4OSwiZXhwIjoxNzM2NjAyMjg5fQ.vrPBRecJYFieQs7OgkkMTnPGLvs-XaXttdVRQ8E3Ahs',
};

const payload = {
  socketId: 'Shy2DK2L1W2GhL9DAAAD',
  userId: '6778d96eeb922bce53f72d39',
};

(async () => {
  for (let i = 0; i < 2; i++) {
    const response = await axios.post(
      'http://localhost:3000/game/start',
      payload,
      { headers },
    );
    console.log(response.data);
  }
})();
