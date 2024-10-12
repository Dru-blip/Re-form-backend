import { Body, Controller, Param, Post } from '@nestjs/common';
import { differenceInMinutes } from 'date-fns';
import { Public } from '../auth/decorators/public.decorator';
import { OTPVerificationDTO } from './dto/otp-verification.dto';
import { OtpsService } from './otps.service';

@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}

  /**
   * Verifies an OTP.
   *
   * @param id - The id of the OTP to verify.
   * @param code - The code to verify.
   * @return {Promise<{ email: string | null, verified: boolean, error: any | null, message: string }>}
   */

  @Post('verify/:id')
  @Public()
  async verifyOTP(
    @Param('id') id: string,
    @Body() code: OTPVerificationDTO,
  ): Promise<{ email: string | null; verified: boolean; message: string }> {
    const otp = await this.otpsService.findOne(id);
    if (differenceInMinutes(Date.now(), otp.expiresIn) <= 0) {
      if (otp.code === code.code) {
        await this.otpsService.makeOTPVerified(otp.id);
        return {
          email: otp.email,
          verified: true,
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
