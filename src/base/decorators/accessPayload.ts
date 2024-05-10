import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user.userId;
    console.log(userId);
    return userId;
  },
);
