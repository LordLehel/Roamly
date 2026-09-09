import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { Request } from 'express';

export const otpLimiter = rateLimit({
  // 15 minutes
  windowMs: 15 * 60 * 1000,
  // maximum attempts at a time
  max: 5,

  // we are blocking based on email address, so an attacker couldn't get trough with vpns
  keyGenerator: (req: Request): string => {
    if (req.body && req.body.email) {
      return req.body.email.toLowerCase();
    }

    // if somehow there is no email address in the body we use ip address
    return req.ip ? ipKeyGenerator(req.ip) : 'unknown_ip';
  },

  message: {
    status: 'error',
    message: 'Too many verification attempts! Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
