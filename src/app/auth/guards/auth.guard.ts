import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Guard For Authentication
@Injectable()
export class AuthGuard implements CanActivate {
  // Inject JwtService and Reflector
  constructor(
    private readonly JwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Checks if a request is authenticated and authorized to access a route.
   *
   * This function is a guard that runs on every request before the route handler is invoked.
   * It checks for the presence of a valid JWT token in the authorization header and verifies it.
   * If the token is valid, it extracts the payload and attaches it to the request object as the user.
   * If the token is invalid or missing, it throws an UnauthorizedException.
   *
   * @param {ExecutionContext} context - The execution context of the request.
   * @return {Promise<boolean>} A promise that resolves to true if the request is authenticated and authorized, false otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if "IsPublic" metadata attached to a controller handler
    const isPublic = this.reflector.get<boolean>(
      'IsPublic',
      context.getHandler(),
    );

    
    // If IsPublic is true return true
    if (isPublic) {
      return true;
    }

    // Get Request Object
    const req: Request = context.switchToHttp().getRequest();

    // Get Token from Authorization Header
    const token = this.extractToken(req.headers.authorization);

    // If Token is not present throw UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }
    // Verify Token
    try {
      // Get Payload From Token after verification
      const payload = await this.JwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        ignoreExpiration:false
      });
      // Attach Payload as user to request
      req.user = payload;
    } catch {
      // any error throw UnauthorizedException
      throw new UnauthorizedException();
    }
    // Return true if everything goes well
    return true;
  }

  /**
   * Extracts the token from the Authorization Header.
   *
   * @param {string} authorization - The Authorization Header string.
   * @return {string|undefined} The extracted token or undefined if the Authorization Header is not present or does not start with 'Bearer'.
   */
  private extractToken(authorization: string): string | undefined {
    // Check if Authorization Header is present
    if (!authorization || !authorization.startsWith('Bearer')) {
      return undefined;
    }
    // Get Token from Authorization Header
    return authorization.split(' ')[1];
  }
}
