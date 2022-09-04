import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth.local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, } from '@nestjs/config';
import { jwtConstants } from './util/jwt.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '/config.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'asd',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, LocalStrategy],
  exports: [AuthService],
})
export class UsersModule {
  // constructor(private configService: ConfigService) {
  //   secret: configService.get<string>('JWT_SECRET')
  // }
}
