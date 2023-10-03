import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findByUsername(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username }).exec();
    }

    async createDefaultUser() {
        const defaultUser = await this.findByUsername('testuser');
        if (!defaultUser) {
            const hashedPassword = await bcrypt.hash('testpassword', 10);
            const user = new this.userModel({
                username: 'testuser',
                password: hashedPassword
            });
            await user.save();
        }
    }

    async updateUser(user: User): Promise<User> {
        return user.save();
    }
    async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
        return this.userModel.findOne({ refreshToken }).exec();
    }


}

