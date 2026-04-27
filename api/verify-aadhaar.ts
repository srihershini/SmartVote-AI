export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { aadhaar, mobile } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ error: 'Invalid Aadhaar number' });
  }

  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({ error: 'Invalid mobile number' });
  }

  return res.status(200).json({
    success: true,
    message: 'Verification successful',
  });
}