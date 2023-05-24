const globalAny: any = global;

import { MongoClient } from 'mongodb';
import { IUser } from 'src/user/user.service';

const mongoClient = MongoClient;

mongoClient
  .connect(
    'mongodb+srv://viniciuscmoreira97:2g3hZOz6RabqgsSv@cluster0.5e5ht3y.mongodb.net/',
  )
  .then((conn) => (globalAny.conn = conn.db('project1')))
  .catch((err) => console.log(err));

export interface IAvatar {
  _id: string;
  hash: string;
  userId: string;
}

export function createDbUser(user: IUser) {
  return globalAny.conn.collection('users').insertOne(user);
}

export function getUserById(id: string) {
  return globalAny.conn.collection('users').findOne({ _id: id });
}

export function createAvatar(hash: string, userId: string, avatarId: string) {
  return globalAny.conn.collection('avatars').insertOne({
    _id: avatarId,
    userId,
    hash,
  });
}

export function getAvatarByUserIdDb(userId: string): Promise<IAvatar> {
  return globalAny.conn.collection('avatars').findOne({ userId });
}

export function deleteAvatar(userId: string) {
  return globalAny.conn.collection('avatars').deleteOne({ userId });
}

module.exports = {
  createDbUser,
  getUserById,
  getAvatarByUserIdDb,
  createAvatar,
  deleteAvatar,
};
