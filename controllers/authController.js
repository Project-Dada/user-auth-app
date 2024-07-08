const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({
      errors: [
        { field: 'firstName', message: 'First name is required' },
        { field: 'lastName', message: 'Last name is required' },
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' },
      ],
    });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });
    
    const org = await Organisation.create({
      orgId: uuidv4(),
      name: `${firstName}'s Organisation`,
      description: '',
    });
    
    await user.addOrganisation(org);
    
    const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }
    
    const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};
