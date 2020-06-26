const { UserModel } = require('../src/models/User')

export const createUserToTest = async (pass = 'testPass') => {
  const userTest = await UserModel.create({ acc: 'testUser', pass })
  process.env.ID_ADMIN = userTest._id
}
