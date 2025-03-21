# Authentication System

This module provides authentication mechanisms for the API gateway, including JWT token and API key-based authentication.

## Architecture

- `AuthService`: Central service for authentication logic
- Guards:
  - `JwtAuthGuard`: Authenticates using JWT tokens
  - `ApiKeyAuthGuard`: Authenticates using API keys

## Key Features

- No global authentication - routes are unprotected by default
- Selective auth via decorators - protect only what you need
- Strongly typed user objects

## Usage Examples

### Protecting a controller or route with JWT authentication

```typescript
import { Controller, Get } from '@nestjs/common';
import { Auth, CurrentUser, CurrentUserType } from 'src/auth';

@Controller('profile')
export class ProfileController {
  @Get()
  @Auth() // Apply JWT authentication only to this route
  getProfile(@CurrentUser() user: CurrentUserType) {
    return user;
  }

  @Get('public')
  getPublicData() {
    // No auth required
    return { message: 'This is public data' };
  }
}
```

### Protecting a specific route with API key authentication

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { Auth, ApiKeyAuth, CurrentUser, CurrentUserType } from 'src/auth';

@Controller('api')
export class ApiController {
  @Get('data')
  @Auth() // JWT authenticated endpoint
  getData(@CurrentUser() user: CurrentUserType) {
    return { data: 'Private data', user };
  }

  @Post('webhook')
  @ApiKeyAuth() // API key authenticated endpoint
  handleWebhook(@CurrentUser() user: CurrentUserType) {
    return { status: 'webhook processed', user };
  }

  @Get('public')
  getPublicData() {
    // No auth required
    return { data: 'Public data' };
  }
}
```

## Schema Requirements

For API key authentication to work properly, you'll need to add the following to your Prisma schema:

```prisma
model ApiKey {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  name      String?
  isActive  Boolean  @default(true)
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([key])
}

model User {
  // ...existing fields
  apiKeys ApiKey[]
}
```
