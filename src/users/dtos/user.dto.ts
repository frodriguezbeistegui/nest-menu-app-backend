import { Exclude, Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
  
  @Exclude()
  password: string;

  @Exclude()
  role: string;

  @Expose()
  id: string;
}
