import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ENDPOINT_KEY = 'isPublicEndpoint';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_ENDPOINT_KEY, true);
