import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { BlacklistService } from "../blacklist/blacklist.service";
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private configService: ConfigService,
        private blacklistService: BlacklistService
    ) {
        super({
            jwtFromRequest: jwtExtractor,
            ignoreExpiration: false,

            secretOrKey: configService.get('JWT_SECRET'),
            passReqToCallback: true
        });

    }

    async validate(request: Request, payload: any) {
        const token = jwtExtractor(request);

        const isBlacklisted = await this.blacklistService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new UnauthorizedException('Token is blacklisted');
        }
        return { userId: payload.sub, username: payload.username };
    }
}

const jwtExtractor = (request: Request) => {
    return request.headers.authorization && request.headers.authorization.split(' ')[1];
};
