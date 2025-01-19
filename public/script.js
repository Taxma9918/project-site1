function selectMenu(menu) {
    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => submenu.classList.add('hidden'));

    const selectedMenu = document.getElementById(`${menu}-menu`);
    if (selectedMenu) selectedMenu.classList.remove('hidden');

    updateMainContent(menu);
}

async function showLinks(category) {
    const mainContent = document.getElementById('main-content');
    try {
        const response = await fetch('links.json');
        const data = await response.json();
        const links = data[category];

        mainContent.innerHTML = `
            <h2>${category === 'web_links' ? 'Διαδικτυακοί Σύνδεσμοι' : 'Βιβλιογραφία'}</h2>
            <table border="1" cellpadding="5">
                <thead>
                    <tr>
                        <th>${category === 'web_links' ? 'Όνομα' : 'Τίτλος'}</th>
                        <th>${category === 'web_links' ? 'URL' : 'Συγγραφέας'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${links.map(link => `
                        <tr>
                            <td>${link.name || link.title}</td>
                            <td>${category === 'web_links' ? `<a href="${link.url}" target="_blank">${link.url}</a>` : link.author}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        mainContent.innerHTML = '<p>Σφάλμα κατά τη φόρτωση των δεδομένων.</p>';
        console.error('Error loading links:', error);
    }
}

async function showExhibitions(category) {
    const mainContent = document.getElementById('main-content');
    try {
        const response = await fetch('exhibitions.json');
        const data = await response.json();
        const exhibitions = data[category];

        mainContent.innerHTML = `
            <h2>${category === 'current' ? 'Τρέχουσες Εκθέσεις' : 'Παρελθούσες Εκθέσεις'}</h2>
            <table border="1" cellpadding="5">
                <thead>
                    <tr>
                        <th>Όνομα</th>
                        <th>Τοποθεσία</th>
                        <th>Ημερομηνία</th>
                    </tr>
                </thead>
                <tbody>
                    ${exhibitions.map(exhibition => `
                        <tr>
                            <td>${exhibition.name}</td>
                            <td>${exhibition.location}</td>
                            <td>${exhibition.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        mainContent.innerHTML = '<p>Σφάλμα κατά τη φόρτωση των δεδομένων.</p>';
        console.error('Error loading exhibitions:', error);
    }
}

let isAdmin = false;

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
        alert('Επιτυχής σύνδεση!');
        document.getElementById('admin-login').classList.add('hidden');

        if (result.role === 'admin') {
            document.getElementById('admin-loggedin').classList.remove('hidden');
        } else {
            document.getElementById('user-loggedin').classList.remove('hidden');
        }
    } else {
        alert('Λάθος όνομα χρήστη ή κωδικός.');
    }
});

function logout() {
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-loggedin').classList.add('hidden');
    document.getElementById('user-loggedin').classList.add('hidden');
    alert('Αποσυνδεθήκατε.');
}

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));


const admin = { username: 'admin', password: '1234' };


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === admin.username && password === admin.password) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/api/exhibitions', (req, res) => {
    const exhibitions = JSON.parse(fs.readFileSync('exhibitions.json'));
    res.json(exhibitions);
});

app.post('/api/exhibitions', (req, res) => {
    const exhibitions = JSON.parse(fs.readFileSync('exhibitions.json'));
    exhibitions.push(req.body);
    fs.writeFileSync('exhibitions.json', JSON.stringify(exhibitions, null, 2));
    res.json({ success: true });
});

app.put('/api/exhibitions/:id', (req, res) => {
    const exhibitions = JSON.parse(fs.readFileSync('exhibitions.json'));
    const index = exhibitions.findIndex(e => e.id === parseInt(req.params.id));
    if (index !== -1) {
        exhibitions[index] = req.body;
        fs.writeFileSync('exhibitions.json', JSON.stringify(exhibitions, null, 2));
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false });
    }
});

app.delete('/api/exhibitions/:id', (req, res) => {
    let exhibitions = JSON.parse(fs.readFileSync('exhibitions.json'));
    exhibitions = exhibitions.filter(e => e.id !== parseInt(req.params.id));
    fs.writeFileSync('exhibitions.json', JSON.stringify(exhibitions, null, 2));
    res.json({ success: true });
});


app.get('/api/links', (req, res) => {
    const links = JSON.parse(fs.readFileSync('links.json'));
    res.json(links);
});

app.post('/api/links', (req, res) => {
    const links = JSON.parse(fs.readFileSync('links.json'));
    links.push(req.body);
    fs.writeFileSync('links.json', JSON.stringify(links, null, 2));
    res.json({ success: true });
});

app.put('/api/links/:id', (req, res) => {
    const links = JSON.parse(fs.readFileSync('links.json'));
    const index = links.findIndex(l => l.id === parseInt(req.params.id));
    if (index !== -1) {
        links[index] = req.body;
        fs.writeFileSync('links.json', JSON.stringify(links, null, 2));
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false });
    }
});

app.delete('/api/links/:id', (req, res) => {
    let links = JSON.parse(fs.readFileSync('links.json'));
    links = links.filter(l => l.id !== parseInt(req.params.id));
    fs.writeFileSync('links.json', JSON.stringify(links, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});



async function showPaintings(category) {
    const mainContent = document.getElementById('main-content');

    try {
        const response = await fetch('paintings.json');
        const data = await response.json();
        const selectedPaintings = data[category];
        mainContent.innerHTML = `
            <h2>${category === 'landscapes' ? 'Τοπία του Ντελακρουά' : 'Πορτρέτα του Ντελακρουά'}</h2>
            <div class="paintings-grid"></div>
        `;
        const grid = document.querySelector('.paintings-grid');
        selectedPaintings.forEach(painting => {
            grid.innerHTML += `
                <div class="painting-card">
                    <img src="images/${painting.image}" alt="${painting.title}">
                    <p>${painting.title}</p>
                </div>
            `;
        });
    } catch (error) {
        mainContent.innerHTML = '<p>Σφάλμα κατά τη φόρτωση των πινάκων.</p>';
        console.error('Error loading paintings:', error);
    }
}


function updateMainContent(menu) {
    const mainContent = document.getElementById('main-content');

    if (menu === 'bio') {
        mainContent.innerHTML = `<h2>Βιογραφία</h2><p>Επιλέξτε κατηγορία βιογραφίας...</p>`;
    } else if (menu === 'paintings') {
        mainContent.innerHTML = `<h2>Πίνακες</h2><div id="paintings-grid" class="flex-container"></div>`;
        loadPaintings('all');
    } else if (menu === 'exhibitions' || menu === 'links') {
        fetchContent(menu);
    } else {
        mainContent.innerHTML = `<h2>Έλεγχος στοιχείων</h2><p>Εισάγετε στοιχεία διαχειριστή ή επισκέπτη.</p>`;
    }
}

function showBiographySection(section) {
    const mainContent = document.getElementById('main-content');
    if (section === 'birth') {
        mainContent.innerHTML = `
            <h2>Γέννηση</h2>
            <p>Γεννήθηκε στις 26 Απριλίου 1798 στο Σαρεντόν-Σαιν-Μορίς (Charenton-Saint Maurice) κοντά στο Παρίσι και ήταν το τέταρτο παιδί του Σαρλ Ντελακρουά, υπουργού Εξωτερικών του Διευθυντηρίου αν και εικάζεται ότι ο πραγματικός του πατέρας ήταν ο Ταλλεϋράνδος, διάσημος διπλωμάτης στον οποίο ο Ευγένιος έμοιαζε στην εμφάνιση και το χαρακτήρα. Ο Σαρλ Ντελακρουά πέθανε το 1805 και η μητέρα του το 1814 αφήνοντάς τον Ευγένιο ορφανό στην ηλικία των 16. Το 1815 μαθήτευσε κοντά στον ζωγράφο Πιερ-Ναρσίς Γκερέν και το 1816 μπήκε στη Σχολή Καλών Τεχνών. Το 1822 παρουσίασε στο Σαλόνι Παρισιού τον πίνακά του «Η βάρκα του Δάντη». Το 1824 παρουσίασε τη «Σφαγή της Χίου», εμπνευσμένος από το πραγματικό γεγονός της Ελληνικής επανάστασης, και ο πίνακας αγοράστηκε από την Γαλλική κυβέρνηση για 6000 νομίσματα.

Εντυπωσιασμένος από τις τεχνικές των Άγγλων ζωγράφων όπως ο Τζον Κόνσταμπλ, ταξίδεψε το 1825 στην Αγγλία όπου επισκέφθηκε πολλές γκαλερί και θέατρα και επηρεάστηκε από τον αγγλικό πολιτισμό. Επίσης έκανε την εικονογράφηση μιας Γαλλικής έκδοσης του Φάουστ με 17 λιθογραφίες, και διάφορων έργων του Ουίλλιαμ Σαίξπηρ και του Σερ Ουόλτερ Σκοτ.</p>
        `;
    } else if (section === 'career') {
        mainContent.innerHTML = `
            <h2>Έργα</h2>
            <p>Μεταξύ 1827 και 1832 παρουσίασε πολλά μεγάλα έργα με ιστορικά θέματα. Το 1827 παρουσίασε στο Σαλόνι τον «Θάνατο του Σαρδανάπαλου» εμπνευσμένο από την ποίηση του Λόρδου Μπάυρον. Εντυπωσίασε και πάλι το κοινό με το σημαντικότερο και τελευταίο ρομαντικό έργο του, το «Η Ελευθερία οδηγεί το Λαό», εμπνευσμένο από την Ιουλιανή επανάσταση του 1830. Ο πίνακας αγοράστηκε και αυτός από την Γαλλική κυβέρνηση αλλά χάρη στην αντίδραση κάποιων αξιωματούχων που θεωρούσαν την προώθηση της ιδέας της ελευθερίας ανατρεπτική, αποσύρθηκε από την κοινή θέα. Παρόλα αυτά, ο Ντελακρουά πήρε αρκετές εργολαβίες για τοιχογραφίες σε δημόσια κτίρια.


«Καβαλάρης Έλληνας αγωνιστής»
Το 1832 ταξίδεψε για 6 μήνες στο Μαρόκο όπου ο αρχαίος και εξωτικός πολιτισμός των αράβων τον ενέπνευσε εκ νέου στην δημιουργία έργων όπως «Οι Φανατικοί της Ταγγέρης» (1837-1838), «Ο Σουλτάνος του Μαρόκου και η Ακολουθία του» (1845), «Κυνήγι Λιονταριών» (1854), «Άραβας Σελώνοντας το Άλογό του» (1855). Οι «Γυναίκες του Αλγερίου» έκαναν μεγάλη επιτυχία στο Σαλόνι του 1834. Το 1833 ζωγράφισε τις τοιχογραφίες στο βασιλικό δωμάτιο του παλατιού των Βουρβόνων, και συνέχισε με διάφορα έργα για το Λούβρο και το Ιστορικό Μουσείο στις Βερσαλλίες, μέχρι το 1861. Μετά τη Γαλλική Επανάσταση του 1848, ο Ναπολέων Γ' επέτρεψε την δημόσια εμφάνιση του έργου «Η Ελευθερία οδηγεί το λαό», το οποίο σήμερα εκθέτεται στο μουσείο του Λούβρου.

Άλλα έργα του είναι «Το Ναυάγιο του Δον Χουάν», «Η Μήδεια πριν σκοτώσει τα παιδιά της», «Η είσοδος των Σταυροφόρων στην Κωνσταντινούπολη» και ένα πορτρέτο του συνθέτη Φρεντερίκ Σοπέν. Έργα του εμπνευσμένα από την Ελληνική επανάσταση είναι «Η Σφαγή της Χίου», «Έφιππος Έλληνας αγωνιστής», «Η Ελλάδα στα ερείπια του Μεσολογγίου» και «Η Μάχη του Γκιαούρη με τον Πασά».

Το 1855 εξέθεσε 48 πίνακες στην Διεθνή Έκθεση Παρισιού και έγινε δεκτός στην Ακαδημία μετά από την όγδοη αίτησή του. Κάνοντας τοιχογραφίες πολλές ώρες όρθιος επάνω σε σκαλωσιές μισοτελειωμένων κτιρίων, αρρώστησε και αποσύρθηκε. Πέθανε στις 13 Αυγούστου 1863 στο Παρίσι.</p>
        `;
    }
}

async function manageExhibitions() {
    const mainContent = document.getElementById('main-content');
    try {
        const response = await fetch('/api/exhibitions');
        const exhibitions = await response.json();

        mainContent.innerHTML = `
            <h2>Διαχείριση Εκθέσεων</h2>
            <table border="1" cellpadding="5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Όνομα</th>
                        <th>Τοποθεσία</th>
                        <th>Ημερομηνία</th>
                    </tr>
                </thead>
                <tbody>
                    ${exhibitions.map(exhibition => `
                        <tr>
                            <td>${exhibition.id}</td>
                            <td>${exhibition.name}</td>
                            <td>${exhibition.location}</td>
                            <td>${exhibition.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading exhibitions:', error);
        mainContent.innerHTML = '<p>Σφάλμα κατά τη φόρτωση των εκθέσεων.</p>';
    }
}

async function manageLinks() {
    const mainContent = document.getElementById('main-content');
    try {
        const response = await fetch('/api/links');
        const links = await response.json();

        mainContent.innerHTML = `
            <h2>Διαχείριση Συνδέσμων</h2>
            <table border="1" cellpadding="5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Όνομα</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    ${links.map(link => `
                        <tr>
                            <td>${link.id}</td>
                            <td>${link.name}</td>
                            <td><a href="${link.url}" target="_blank">${link.url}</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading links:', error);
        mainContent.innerHTML = '<p>Σφάλμα κατά τη φόρτωση των συνδέσμων.</p>';
    }
}

