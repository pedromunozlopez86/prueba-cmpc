import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.comparePassword(password))) {
      const { password: _, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    this.logger.log(`User logged in successfully: ${loginDto.email}`);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for: ${registerDto.email}`);
    
    const user = await this.usersService.create(registerDto);
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    this.logger.log(`User registered successfully: ${registerDto.email}`);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
