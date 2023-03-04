import { JwtPayloadDto } from '../../auth/dto/jwt-payload.dto';

export type IRequest = {
  user: JwtPayloadDto;
};
