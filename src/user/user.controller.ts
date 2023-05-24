import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpStatus,
  Res,
  Delete,
} from '@nestjs/common';
import { IUser, UserService } from './user.service';
import { Response } from 'express';

interface IgetUserByIdParam {
  id: string;
}
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: any): Promise<any> {
    return this.userService.create(user);
  }

  @Get(':id')
  async getUserById(
    @Param() params: IgetUserByIdParam,
    @Res() res: Response,
  ): Promise<IUser | Response<any, Record<string, any>>> {
    const user = await this.userService.getById(params.id);
    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User not found with this id' });
    }

    return user;
  }

  @Get(':id/avatar')
  async getAvatarBase64(
    @Param() params: IgetUserByIdParam,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.userService.getById(params.id);
    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User not found with this id' });
    }

    if (!user.avatar) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: `User don't have any avatar registered!` });
    }
    const imageBase64 = await this.userService.getAvatarByUserId(user);

    return res.status(HttpStatus.OK).json({ imgBase64: imageBase64 });
  }

  @Delete(':id/avatar')
  async deleteAvatar(
    @Param() params: IgetUserByIdParam,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.userService.getById(params.id);
    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User not found with this id' });
    }

    await this.userService.deleteAvatarData(user._id);
  }
}
