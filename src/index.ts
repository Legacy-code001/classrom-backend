import  express  from 'express';

import subjectRouter from './routes/subjects';

const app = express();
const PORT = 8000;

app.use(express.json());

app.use('/api/subjects', subjectRouter )

app.get(('/'), (req, res)=> {
    res.send("Hellol welcome to the classroom api")
})

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`)
})