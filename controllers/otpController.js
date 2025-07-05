const otpStore = {}; // { mobile: { otp, expiresAt } }

export const sendOTP = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: 'Mobile number required' });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
  const expiresAt = Date.now() + 2 * 60 * 1000; // 2 mins

  otpStore[mobile] = { otp, expiresAt };

  console.log(`OTP for ${mobile}: ${otp}`); // Replace with SMS API here

  return res.json({ success: true, message: 'OTP sent' });
};

export const verifyOTP = (req, res) => {
  const { mobile, otp } = req.body;
  const record = otpStore[mobile];

  if (!record) return res.status(400).json({ error: 'No OTP sent to this number' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ error: 'OTP expired' });
  if (parseInt(otp) !== record.otp) return res.status(400).json({ error: 'Invalid OTP' });

  delete otpStore[mobile]; // clear after success
  return res.json({ success: true, message: 'OTP verified' });
};
