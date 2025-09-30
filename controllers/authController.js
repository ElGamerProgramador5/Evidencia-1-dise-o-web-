const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Medico } = require('../models');

async function login(req, res) {
  const { email, password } = req.body;
  const medico = await Medico.findOne({ where: { email } });
  if (!medico) return res.status(401).json({ msg: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, medico.password_hash);
  if (!valid) return res.status(401).json({ msg: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: medico.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ msg: 'Login exitoso' });
}

async function logout(req, res) {
  res.clearCookie('token');
  res.json({ msg: 'Logout exitoso' });
}

module.exports = { login, logout };
