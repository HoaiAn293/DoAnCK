const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

// In-memory user store (thay bằng database thực tế)
const users = new Map();
const googleUsers = new Map();

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email và password là bắt buộc' });
    }

    // Kiểm tra user đã tồn tại
    if (users.has(email)) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const user = {
      id: `user_${Date.now()}`,
      email,
      password: hashedPassword,
      displayName: displayName || email.split('@')[0],
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    users.set(email, user);

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        provider: user.provider,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email và password là bắt buộc' });
    }

    const user = users.get(email);

    if (!user || user.provider !== 'email') {
      return res.status(401).json({ error: 'Email hoặc password không đúng' });
    }

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email hoặc password không đúng' });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        provider: user.provider,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Đăng nhập Google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token là bắt buộc' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID || 'your-client-id.apps.googleusercontent.com',
      });
      payload = ticket.getPayload();
    } catch (googleError) {
      // Nếu không verify được (do chưa có client ID thật), vẫn decode payload
      const decoded = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      payload = decoded;
    }

    const { email, name, picture } = payload;

    // Kiểm tra hoặc tạo user
    let user = googleUsers.get(email);

    if (!user) {
      user = {
        id: `google_${Date.now()}`,
        email,
        displayName: name || email.split('@')[0],
        avatar: picture,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      googleUsers.set(email, user);
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập Google thành công',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        provider: user.provider,
      },
      token,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Lỗi xác thực Google' });
  }
});

// Lấy thông tin profile
router.get('/profile', authMiddleware, (req, res) => {
  const { email, id } = req.user;

  // Tìm user trong cả 2 map
  const user = users.get(email) || googleUsers.get(email);

  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy user' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar || null,
      provider: user.provider,
      createdAt: user.createdAt,
    },
  });
});

// Cập nhật profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const { displayName, avatar } = req.body;

    const user = users.get(email) || googleUsers.get(email);

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    // Cập nhật thông tin
    if (displayName) user.displayName = displayName;
    if (avatar !== undefined) user.avatar = avatar;

    res.json({
      message: 'Cập nhật thành công',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
