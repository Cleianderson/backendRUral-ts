import { UserModel } from '~/models/User'

export async function validateUserByPassword (req, res, next): Promise<boolean> {
  const bodyPassword = req.body.pass
  const queryPassword = req.query.pass

  const userByPassword = await UserModel.findOne({ pass: bodyPassword || queryPassword })
  if (userByPassword && String(userByPassword._id) === String(process.env.ID_ADMIN)) { next() } else {
    return res.status(400).json({ error: 'Invalid Password' })
  }
}
