import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MailService } from './mailservice';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    console.log('Email:', email); // Log the email
    console.log('Password:', password); // Log the password
  
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      console.log('User not found'); // Log if user is not found
      return null;
    }
  
    console.log('Stored Hashed Password:', user.password); // Log the stored hashed password
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      console.log('Invalid password'); // Log if password is invalid
      return null;
    }
  
    console.log('User validated:', user); // Log the validated user
    return user;
  }
  
  async create(user: Partial<User>): Promise<User> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds
    user.password = hashedPassword;

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  // READ ALL
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // READ ONE
  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // UPDATE
  async update(id: number, user: Partial<User>): Promise<User> {
    // If the password is being updated, hash it first
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  // DELETE
  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
  }

  // Sending email with a temporary password or reset link
  async verifyUserAndSendEmail(cin: string, email: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { cin, email } });

    if (!user) {
      throw new NotFoundException('User not found with this email and CIN.');
    }

    // Generate a temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8); // 8-character random string
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // Send the temporary password via email
    await this.mailService.sendEmail(
      user.email,
      'Your Temporary Password',
      `Your temporary password is: ${temporaryPassword}. Please change it after logging in.`,
    );

    return 'Email sent successfully. Check your email for the temporary password.';
  }
}