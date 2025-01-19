const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Welcome to the Delacroix App!');
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const users = [
    { username: 'admin', password: '1234', role: 'admin' },
    { username: 'user', password: 'user1234', role: 'user' }
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, role: user.role });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

app.get('/api/exhibitions', (req, res) => {
    try {
        const exhibitions = JSON.parse(fs.readFileSync('public/exhibitions.json'));
        res.json(exhibitions);
    } catch (error) {
        console.error('Error reading exhibitions:', error);
        res.status(500).json({ message: 'Failed to load exhibitions' });
    }
});

app.post('/api/exhibitions', (req, res) => {
    const exhibitions = JSON.parse(fs.readFileSync('public/exhibitions.json'));
    exhibitions.push(req.body);
    fs.writeFileSync('public/exhibitions.json', JSON.stringify(exhibitions, null, 2));
    res.json({ success: true });
});

app.put('/api/exhibitions/:id', (req, res) => {
    const exhibitions = JSON.parse(fs.readFileSync('public/exhibitions.json'));
    const index = exhibitions.findIndex(e => e.id === parseInt(req.params.id));
    if (index !== -1) {
        exhibitions[index] = req.body;
        fs.writeFileSync('public/exhibitions.json', JSON.stringify(exhibitions, null, 2));
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Exhibition not found' });
    }
});

app.delete('/api/exhibitions/:id', (req, res) => {
    let exhibitions = JSON.parse(fs.readFileSync('public/exhibitions.json'));
    exhibitions = exhibitions.filter(e => e.id !== parseInt(req.params.id));
    fs.writeFileSync('public/exhibitions.json', JSON.stringify(exhibitions, null, 2));
    res.json({ success: true });
});

app.get('/api/links', (req, res) => {
    try {
        const links = JSON.parse(fs.readFileSync('public/links.json'));
        res.json(links);
    } catch (error) {
        console.error('Error reading links:', error);
        res.status(500).json({ message: 'Failed to load links' });
    }
});

app.post('/api/links', (req, res) => {
    const links = JSON.parse(fs.readFileSync('public/links.json'));
    links.push(req.body);
    fs.writeFileSync('public/links.json', JSON.stringify(links, null, 2));
    res.json({ success: true });
});

app.put('/api/links/:id', (req, res) => {
    const links = JSON.parse(fs.readFileSync('public/links.json'));
    const index = links.findIndex(l => l.id === parseInt(req.params.id));
    if (index !== -1) {
        links[index] = req.body;
        fs.writeFileSync('public/links.json', JSON.stringify(links, null, 2));
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Link not found' });
    }
});

app.delete('/api/links/:id', (req, res) => {
    let links = JSON.parse(fs.readFileSync('public/links.json'));
    links = links.filter(l => l.id !== parseInt(req.params.id));
    fs.writeFileSync('public/links.json', JSON.stringify(links, null, 2));
    res.json({ success: true });
});
