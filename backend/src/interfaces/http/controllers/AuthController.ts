import { Request, Response } from 'express';
import { container } from '../../../container';
import { RegisterUserHandler } from '../../../application/auth/handlers/RegisterUserHandler';
import { LoginHandler } from '../../../application/auth/handlers/LoginHandler';
import { VerifyEmailHandler } from '../../../application/auth/handlers/VerifyEmailHandler';
import { ForgotPasswordHandler } from '../../../application/auth/handlers/ForgotPasswordHandler';
import { ResetPasswordHandler } from '../../../application/auth/handlers/ResetPasswordHandler';
import { RefreshTokenHandler } from '../../../application/auth/handlers/RefreshTokenHandler';
import { LogoutHandler } from '../../../application/auth/handlers/LogoutHandler';
import { ApiResponse } from '../../../utils/ApiResponse';
import { env } from '../../../config/env';

const parseCookies = (cookieHeader?: string): Record<string, string> => {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    list[parts.shift()!.trim()] = decodeURI(parts.join('='));
  });
  return list;
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.setHeader('Set-Cookie', `refreshToken=${encodeURIComponent(token)}; Path=/; HttpOnly; ${env.NODE_ENV === 'production' ? 'Secure;' : ''} SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
};

const clearRefreshTokenCookie = (res: Response) => {
  res.setHeader('Set-Cookie', `refreshToken=; Path=/; HttpOnly; ${env.NODE_ENV === 'production' ? 'Secure;' : ''} SameSite=Strict; Max-Age=0`);
};

export class AuthController {
  public register = async (req: Request, res: Response): Promise<void> => {
    const handler = container.resolve(RegisterUserHandler);
    const result = await handler.execute(req.body);
    res.status(201).json(ApiResponse.success(result, 'Registration successful. Verification email sent.'));
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const handler = container.resolve(LoginHandler);
    const result = await handler.execute({
      ...req.body,
      deviceFingerprint: req.headers['user-agent'],
    });
    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json(ApiResponse.success({
      accessToken: result.accessToken,
      user: result.user,
    }, 'Login successful'));
  };

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const handler = container.resolve(VerifyEmailHandler);
    const result = await handler.execute({ token: req.body.token || req.query.token as string });
    res.status(200).json(ApiResponse.success(null, result.message));
  };

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const handler = container.resolve(ForgotPasswordHandler);
    const result = await handler.execute({
      email: req.body.email,
      ipAddress: req.ip || undefined,
    });
    res.status(200).json(ApiResponse.success(null, result.message));
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const handler = container.resolve(ResetPasswordHandler);
    await handler.execute(req.body);
    res.status(200).json(ApiResponse.success(null, 'Password reset successfully'));
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.refreshToken || req.body.refreshToken;
    
    if (!token) {
      res.status(400).json(ApiResponse.error('Refresh token is missing'));
      return;
    }

    const handler = container.resolve(RefreshTokenHandler);
    const result = await handler.execute({
      refreshToken: token,
      deviceFingerprint: req.headers['user-agent'],
    });

    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json(ApiResponse.success({
      accessToken: result.accessToken,
    }, 'Token refreshed successfully'));
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.refreshToken || req.body.refreshToken;
    
    if (token) {
      try {
        const handler = container.resolve(LogoutHandler);
        await handler.execute({ refreshToken: token });
      } catch (e) {
        // Soft fail if session doesn't exist, just clear cookies
      }
    }
    clearRefreshTokenCookie(res);
    res.status(200).json(ApiResponse.success(null, 'Logged out successfully'));
  };
}
