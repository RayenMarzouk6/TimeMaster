import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure session middleware
  app.use(
    session({
      secret: '12345678', // Replace with a secure key (use environment variables in production)
      resave: false, // Avoid resaving sessions if they haven't changed
      saveUninitialized: false, // Avoid saving uninitialized sessions
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60 * 24, // Session duration (e.g., 1 day)
      },
    }),
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: ['*'], // Allow the Flutter app origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], // Allow specific headers
    credentials: true, // Allow cookies and sessions to be sent cross-origin
  });

  await app.listen(3000); 
  console.log('Server is running on http://localhost:3000');
}
bootstrap();