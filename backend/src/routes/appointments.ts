import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/appointments
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { clientId, status, from, to } = req.query as Record<string, string>;

  const where: Record<string, unknown> = {};
  if (clientId) where.clientId = clientId;
  if (status) where.status = status;
  if (from || to) {
    where.date = {};
    if (from) (where.date as Record<string, unknown>).gte = new Date(from);
    if (to) (where.date as Record<string, unknown>).lte = new Date(to);
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { date: 'asc' },
    include: {
      client: { select: { id: true, name: true, phone: true } },
    },
  });

  return res.json(appointments);
});

// POST /api/appointments
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { clientId, date, duration, type, notes } = req.body;

  if (!clientId || !date || !type) {
    return res.status(400).json({ error: 'Client, date et type requis' });
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId,
      date: new Date(date),
      duration: duration || 60,
      type,
      notes,
    },
    include: {
      client: { select: { id: true, name: true, phone: true } },
    },
  });

  return res.status(201).json(appointment);
});

// GET /api/appointments/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, phone: true } },
      payments: true,
    },
  });
  if (!appointment) return res.status(404).json({ error: 'Rendez-vous introuvable' });
  return res.json(appointment);
});

// PUT /api/appointments/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { date, duration, type, status, notes } = req.body;

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      date: date ? new Date(date) : undefined,
      duration,
      type,
      status,
      notes,
    },
    include: {
      client: { select: { id: true, name: true, phone: true } },
    },
  });

  return res.json(appointment);
});

// DELETE /api/appointments/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.appointment.delete({ where: { id } });
  return res.json({ message: 'Rendez-vous supprimé' });
});

export default router;
