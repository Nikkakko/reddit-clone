import * as z from 'zod';

export const formSchema = z.object({
  input: z
    .string()
    .min(1, {
      message: 'Community name must be at least 1 character long',
    })
    .max(255),
});
