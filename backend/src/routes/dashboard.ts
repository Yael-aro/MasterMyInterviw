import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { startOfMonth, endOfMonth, addMonths, subMonths, startOfDay, endOfDay, addDays } from 'date-fns';

const router = Router();
const prisma = new PrismaClient();

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (_req: AuthRequest, res: Response) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weekEnd = endOfDay(addDays(now, 7));
  const todayStart = startOfDay(now);

  const [
    monthRevenue,
    upcomingAppointments,
    activeClients,
    todayAppointments,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: 'PAID', date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.appointment.findMany({
      where: { status: 'SCHEDULED', date: { gte: todayStart, lte: weekEnd } },
      orderBy: { date: 'asc' },
      take: 5,
      include: { client: { select: { id: true, name: true, phone: true } } },
    }),
    prisma.client.count({
      where: { status: { in: ['PROSPECT', 'IN_PREP', 'INTERVIEWED'] } },
    }),
    prisma.appointment.count({
      where: { status: 'SCHEDULED', date: { gte: todayStart, lte: endOfDay(now) } },
    }),
  ]);

  return res.json({
    monthRevenue: monthRevenue._sum.amount || 0,
    upcomingCount: upcomingAppointments.length,
    activeClients,
    todayCount: todayAppointments,
    upcomingAppointments,
  });
});

// GET /api/dashboard/revenue-chart
router.get('/revenue-chart', authenticate, async (_req: AuthRequest, res: Response) => {
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    const result = await prisma.payment.aggregate({
      where: { status: 'PAID', date: { gte: start, lte: end } },
      _sum: { amount: true },
    });

    months.push({
      month: start.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      revenue: result._sum.amount || 0,
    });
  }

  return res.json(months);
});

export default router;
