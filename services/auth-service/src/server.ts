import app from './index';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
});
