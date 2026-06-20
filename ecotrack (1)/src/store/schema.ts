import { z } from 'zod';

export const activityCategorySchema = z.enum(['Transport', 'Food', 'Energy']);

export const loggedActivitySchema = z.object({
  id: z.string(),
  category: activityCategorySchema,
  name: z.string().max(80),
  value: z.number().positive(),
  saved: z.number().min(0),
  unit: z.string(),
  timestamp: z.coerce.date(),
  dateStr: z.string()
});

export const achievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  savedText: z.string(),
  progressPercentage: z.number().min(0).max(100).optional(),
  level: z.number().min(0),
  locked: z.boolean(),
  iconType: z.enum(['tree', 'bus', 'gourmet', 'solar'])
});

export const storedDataSchema = z.object({
  totalSaved: z.number().min(0).catch(240.0),
  currentFootprint: z.number().min(0).catch(140.0),
  footprintGoal: z.number().min(50).max(500).catch(180.0),
  loggedActivities: z.array(loggedActivitySchema).catch([]),
  achievements: z.array(achievementSchema).catch([]),
  dailyMissionCompleted: z.boolean().catch(false),
});
