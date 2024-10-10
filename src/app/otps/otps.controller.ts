import { Body, Controller, Param, Post } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { Public } from '../auth/decorators/public.decorator';
import { OTPVerificationDTO } from './dto/otp-verification.dto';
import { differenceInMinutes } from 'date-fns';
import { error } from 'console';

@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}

  @Post('verify/:id')
  @Public()
  async verifyOTP(@Param('id') id: string, @Body() code: OTPVerificationDTO) {
    const otp = await this.otpsService.findOne(id);
    if (differenceInMinutes(Date.now(), otp.expiresIn) <= 0) {
      if (otp.code === code.code) {
        await this.otpsService.makeOTPVerified(otp.id)
        return {
          email: otp.email,
          verified: true,
          error: null,
          message: 'verification successful',
        };
      } else {
        return { email: null, message: 'invalid code', verified: false };
      }
    } else {
      return { email: null, message: 'code expired', verified: false };
    }
  }
}
