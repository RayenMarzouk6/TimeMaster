import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  HttpStatus,
  HttpException,
  Delete,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express'; // For typing the response object
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
async login(
  @Body('email') email: string,
  @Body('password') password: string,
  @Session() session: Record<string, any>, // Session object
  @Res() res: Response, // Response object
) {
  try {
    console.log('Login request received:', { email, password }); // Log the request

    const user = await this.userService.validateUser(email, password);

    if (!user) {
      console.log('Login failed: Incorrect email or password'); // Log failure
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Incorrect email or password',
      });
    }

    console.log('Login successful:', user); // Log success

    // Save user info in session
    session.userId = user.id; // Ensure session is properly initialized

    // Determine redirect URL based on user role
    const redirectUrl = user.role === 'admin' ? '/dashboard' : '/';

    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      redirectUrl,
    });
  } catch (error) {
    console.error('Error in login:', error); // Log the error
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  }
}

  @Post('verify')
  async verifyUserAndSendEmail(@Body() body: { cin: string; email: string }): Promise<string> {
    try {
      return await this.userService.verifyUserAndSendEmail(body.cin, body.email);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() user: Partial<User>): Promise<User> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    try {
      const user = await this.userService.findOne(id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userService.update(id, user);

      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return updatedUser;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    try {
      const user = await this.userService.findOne(id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userService.delete(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}