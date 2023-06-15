const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
// Conexión a la base de datos MongoDB
mongoose.connect('mongodb+srv://rrojamir:KRYYiiKLOi71YWwq@4emstudios.0ejggy5.mongodb.net/botwsppru', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a la base de datos MongoDB');
});

// Definición del esquema y el modelo
const itemSchema = new mongoose.Schema({
  producto: String,
  precio: Number,
  descripcion: String,
});
const Item = mongoose.model('producto', itemSchema);
// Ruta para obtener todos los registros
app.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
  }
});

// Ruta para crear un nuevo registro
app.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al crear el registro' });
  }
});

// Ruta para obtener un registro por su ID
app.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'El registro no fue encontrado' });
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al obtener el registro' });
  }
});

// Ruta para actualizar un registro existente
app.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ error: 'El registro no fue encontrado' });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el registro' });
  }
});

// Ruta para eliminar un registro existente
app.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'El registro no fue encontrado' });
    }
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el registro' });
  }
});

// Iniciar el servidor
const port = 80;
app.listen(port, () => {
  console.log(`Servidor web en funcionamiento en http://localhost:${port}`);
});
