import mongoose from 'mongoose'

type UserSchema = {acc: string, pass: string} & mongoose.Document

const userSchema = new mongoose.Schema({
  acc: { type: String, required: true },
  pass: { type: String, required: true }
})

export const UserModel = mongoose.model<UserSchema>('User', userSchema)
