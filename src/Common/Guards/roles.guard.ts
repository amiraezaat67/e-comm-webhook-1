import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../Decorators";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private refelector: Reflector) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        // const allowedRoles = this.refelector.getAllAndOverride(Roles, [context.getClass(), context.getHandler()])
        // const allowedRoles = this.refelector.getAllAndMerge(Roles, [context.getClass(), context.getHandler()])
        // const allowedRoles = this.refelector.get(Roles, context.getClass())
        const allowedRoles = this.refelector.get('roles', context.getHandler())

        const request = context.switchToHttp().getRequest();
        const userRole = request['authUser'].user.role

        return allowedRoles.includes(userRole)
    }
}
