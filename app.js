const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'dev-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// User store (use a database in production)
const users = {
    'admin': { password: bcrypt.hashSync('admin123', 10), name: 'Admin User' },
    'user': { password: bcrypt.hashSync('user123', 10), name: 'Regular User' }
};

// Middleware to check auth
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && bcrypt.compareSync(password, users[username].password)) {
        req.session.user = { username, name: users[username].name };
        res.redirect('/dashboard');
    } else {
        res.send(`
            <script>
                alert('Invalid username or password');
                window.location.href = '/login';
            </script>
        `);
    }
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/user', requireAuth, (req, res) => {
    res.json({ username: req.session.user.username, name: req.session.user.name });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
