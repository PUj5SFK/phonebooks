const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { v4: uuidv4 } = require('uuid');

const persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "16f3c3af-7328-4cad-b2ed-295e83a76cc8",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "b231d222-4d9c-4bad-8712-3e10c8095a2d",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "64a98be8-fb3d-4854-a16a-426dbee17942",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "47e9ce15-515c-4217-97a6-fe3030b69c2a",
  },
];

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'))
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/", (request, response) => {
  response.status(200).send('<h1>Hello world</h1>');
});

app.get("/api/person", (request, response) => {
  response.status(200).send(persons);
});

app.put('/api/person', (req, res) => {
  const index = persons.findIndex((person) => req.body.id == person.id);
  const newObject = {
    ...req.body,
    id: index == -1 ? uuidv4() : persons[index].id,
  };
  index == -1
    ? persons.push(newObject)
    : (persons[index].number = req.body.number);
  res.send(newObject);
});

app.delete('/api/person/:id', (req, res) => {
  const filt = persons.filter((person) => person.id !== req.params.id);
    persons.length = 0;
    persons.push(...filt);
    res.status(200).send({ message: 'delete OK' })
});

app.get('/api/person/info',(request,response) => {
  const newObject = {
    time:new Date().toString(),
    length: persons.length
  }
  response.status(200).json(newObject)
})

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  `serve running on http://localhost:${PORT} port/ `;
});
