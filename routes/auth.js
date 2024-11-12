const { User, Supplier, Buyer } = require('../models/user'); 
const bcrypt = require('bcrypt');  
const route = require('express').Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Login route
route.post('/login', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' } // Token expires in 2 hour
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      role: user.role, 
      name: user.name 
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({ error: 'Server error during login' });
  }
});

// Signup route
route.post('/signup', async (req, res) => {
  try {
    let { email, password, role, name, mobile, companyName, address } = req.body;
    
    // Check if the user already exists
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: 'User already exists' });

    // Hash the password
    password = await bcrypt.hash(password, 12);
    
    // Create new User
    const newUser = new User({ email, password, mobile, name, role });
    await newUser.save();

    // Create corresponding Supplier or Buyer
    if (role === 'buyer') {
      const newBuyer = new Buyer({ user: newUser._id, email, companyName, address });
      await newBuyer.save();
    } else if (role === 'supplier') {
      const newSupplier = new Supplier({ user: newUser._id, email, companyName, address });
      await newSupplier.save();
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).send({ error: 'Server error during signup' });
  }
});

module.exports = route;
