import { prisma } from './prisma';

export async function logAction(
  userId: string,
  action: string,
  target?: string,
  details?: Record<string, unknown>
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      target,
      details: details ? JSON.stringify(details) : null,
    },
  });
}
