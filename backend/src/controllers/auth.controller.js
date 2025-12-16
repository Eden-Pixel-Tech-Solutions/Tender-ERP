const { login } = require('../services/auth.service');

const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const data = await login(email, password, rememberMe);
    res.json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/* Forgot password (mock for now) */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Later: send email with token
  res.json({
    message: 'Password reset instructions sent to email'
  });
};

module.exports = {
  loginUser,
  forgotPassword
};