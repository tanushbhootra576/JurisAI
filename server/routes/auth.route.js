import express from 'express';
import User from '../models/ourmap.js';
import { generateVerificationCode } from '../utils/verification.js';
import mailer, { sendWelcomeEmail, sendVerificationCodeEmail } from '../utils/mailer.js';
import contactAckTemplate from '../utils/templates/contactAck.js';
import { generateToken, protect } from '../utils/auth.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Google OAuth login/register
router.post('/google', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Google token is required' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Register new user
      user = await User.create({
        name,
        email,
        verified: true, // Google emails are already verified
        avatar: picture
      });
      // Optionally send welcome email
      // await sendWelcomeEmail({ to: email, name });
    }

    // Generate our own JWT
    const jwtToken = generateToken(user._id);

    res.json({
      message: "Successful",
      token: jwtToken,
      user: {
        name: user.name,
        email: user.email,
        verified: Boolean(user.verified),
        avatar: user.avatar || null,
        avatarIndex: typeof user.avatarIndex === 'number' ? user.avatarIndex : null
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Send welcome email
router.post('/send-welcome', async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    await sendWelcomeEmail({ to: email, name: name || 'there' });
    return res.status(200).json({ message: 'Welcome email sent' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Contact form: forwards message to site admin and optionally acknowledges the sender
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!email || !message) return res.status(400).json({ error: 'Email and message are required.' });

    const adminTo = process.env.MAIL_TO || process.env.MAIL_FROM || process.env.SMTP_USER;
    if (!adminTo) return res.status(500).json({ error: 'Admin email is not configured on server.' });

    const mailSubject = `Contact form: ${subject || 'No subject'}`;
    const text = `From: ${name || 'Anonymous'} <${email}>\n\n${message}`;
    const html = `<p><strong>From:</strong> ${name || 'Anonymous'} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
      <hr/>
      <p>${message.replace(/\n/g, '<br/>')}</p>`;

    // send to admin
    await mailer.sendMail({ to: adminTo, subject: mailSubject, text, html });

    // optional: acknowledgement to sender (non-blocking)
    try {
      const ackSubject = 'Thanks for contacting JurisAI';
      const ackHtml = contactAckTemplate({ name, message });
      await mailer.sendMail({ to: email, subject: ackSubject, html: ackHtml });
    } catch (err) {
      // don't fail the request if acknowledgement fails
      console.warn('Failed to send acknowledgement email', err.message || err);
    }

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// Update user profile (name/avatar)
// Accepts { name, avatar, avatarIndex }
router.patch('/user', protect, async (req, res) => {
  try {
    const { name, avatar, avatarIndex } = req.body || {};
    const email = req.user.email; // Extracted securely from token

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user found with this email.' });

    const updates = {};
    if (typeof name === 'string') updates.name = name;
    if (typeof avatar === 'string') updates.avatar = avatar;
    if (typeof avatarIndex === 'number') updates.avatarIndex = avatarIndex;

    // Only update if there's something to change
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    await User.updateOne({ email }, { $set: updates });
    const updated = await User.findOne({ email }).lean();

    // Return sanitized user object
    const payload = {
      name: updated.name,
      email: updated.email,
      verified: Boolean(updated.verified),
      avatar: updated.avatar || null,
      avatarIndex: typeof updated.avatarIndex === 'number' ? updated.avatarIndex : null
    };
    return res.status(200).json({ message: 'Profile updated', user: payload });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
