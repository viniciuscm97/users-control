import { Injectable } from '@nestjs/common';
import {
  createAvatar,
  createDbUser,
  deleteAvatar,
  getAvatarByUserIdDb,
  getUserById,
} from '../database/db';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { readFile, writeFile, mkdir, rmdir, rm } from 'fs/promises';

export interface IUser {
  _id: string;
  email: string;
  name: string;
  avatar: string;
}

@Injectable()
export class UserService {
  async create(user: IUser) {
    try {
      if (!user._id) {
        user._id = uuidv4();
      }
      await createDbUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id: string): Promise<IUser> {
    return getUserById(id);
  }

  async getAvatarByUserId(user: IUser) {
    const userAvatar = await getAvatarByUserIdDb(user._id);

    if (userAvatar) {
      try {
        const file = await readFile(`src/user/assets/${userAvatar.hash}.png`, {
          encoding: 'base64',
        });

        return file;
      } catch (error) {
        console.log(error);
      }
    } else {
      let hash = '';
      try {
        const image = await axios.get(user.avatar, {
          responseType: 'arraybuffer',
        });
        const imageBase64 = Buffer.from(image.data).toString('base64');

        hash = uuidv4();
        const avatarId = uuidv4();

        await writeFile(`src/user/assets/${hash}.png`, imageBase64, {
          encoding: 'base64',
        });
        await createAvatar(hash, user._id, avatarId);

        return imageBase64;
      } catch (error) {
        await rm(`src/user/assets/${hash}`);
      }
    }
  }

  async deleteAvatarData(userId: string) {
    const userAvatar = await getAvatarByUserIdDb(userId);

    await rm(`src/user/assets/${userAvatar.hash}.png`);

    await deleteAvatar(userId);
  }
}
