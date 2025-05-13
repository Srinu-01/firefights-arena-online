
import { z } from 'zod';

const uidRegex = /^\d{5,12}$/; // 5-12 digits

export const playerSchema = z.object({
  player1IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player1UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
  player2IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player2UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
  player3IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player3UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
  player4IGN: z.string().min(3, { message: 'IGN must be at least 3 characters' }),
  player4UID: z.string().regex(uidRegex, { message: 'UID must be 5-12 digits' }),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
