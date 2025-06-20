import { z } from 'zod';

export const CreateUserSchema = z.object({
    email:z.string().email('Invaild email format'),
    password:z.string().min(8,'Password cannot be less than 8 characters'),
    name:z.string().min(3,'Name cannot be less than 3 characters')
});

export const SignInUserSchema = z.object({
    email:z.string().email('Invaild email format'),
    password:z.string().min(8,'Password cannot be less than 8 characters')
});

export const CreateRoomSchema = z.object({
    name:z.string().min(3,'Name cannot be less than 3 characters')
});