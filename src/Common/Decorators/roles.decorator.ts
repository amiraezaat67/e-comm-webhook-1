// import { Reflector } from "@nestjs/core";
// export const Roles = Reflector.createDecorator<string[]>()


import { createParamDecorator, ExecutionContext , SetMetadata } from '@nestjs/common';
export const Roles = (roles: string[]) => SetMetadata('roles', roles)



export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.authUser; // Extract the user from the request
});