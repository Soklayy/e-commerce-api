import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/commons/decorators/public.decorator';
import { TokensResponse } from 'src/commons/schema/auth.shcema';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from 'src/commons/guard/refresh.guard';
import { ForgotDto } from './dto/forgot.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request, Response } from 'express';
import { VerificationDto } from './dto/verifivation.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokensResponse,
  })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const token = await this.authService.registerUser(dto);
    res.cookie('auth._refresh_token.local', token?.refreshToken, {
      signed: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    }); //15 day
    return token;
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokensResponse,
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const token = await this.authService.login(dto);
    res.cookie('auth._refresh_token.local', token?.refreshToken, {
      signed: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    }); //15 day
    return token;
  }

  @ApiBearerAuth()
  @Get('logout')
  @ApiOkResponse({ description: 'Successful logout' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Req() req: Request): Promise<any> {
    await this.authService.logout(req.user?.id);
    return {
      message: 'Successful logout',
    };
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOkResponse({ description: 'Successful Response' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getLoggedInUser(@Req() req: Request) {
    return req?.user;
  }

  @Public()
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({
    type: TokensResponse,
  })
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user?.id;
    const refreshToken = req.user?.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @Post('/forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'User forgot password' })
  async forgotPassword(@Body() dto: ForgotDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('/reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'User reset password' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Post('/verify-email')
  @HttpCode(200)
  @ApiOperation({ summary: 'User verify email' })
  async verifyEmail(@Body() dto: VerificationDto) {
    return this.authService.verifiEmail(dto);
  }
}
