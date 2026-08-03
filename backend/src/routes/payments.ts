import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/payments
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

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      client: { select: { id: true, name: true } },
      appointment: { select: { id: true, type: true, date: true } },
    },
  });

  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);

  return res.json({ payments, totalPaid, totalPending });
});

// POST /api/payments
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { clientId, appointmentId, amount, method, status, date, label } = req.body;

  if (!clientId || !amount || !label) {
    return res.status(400).json({ error: 'Client, montant et libellé requis' });
  }

  const payment = await prisma.payment.create({
    data: {
      clientId,
      appointmentId: appointmentId || null,
      amount: parseFloat(amount),
      method: method || 'TRANSFER',
      status: status || 'PENDING',
      date: date ? new Date(date) : new Date(),
      label,
    },
    include: {
      client: { select: { id: true, name: true } },
      appointment: { select: { id: true, type: true, date: true } },
    },
  });

  return res.status(201).json(payment);
});

// GET /api/payments/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true } },
      appointment: { select: { id: true, type: true, date: true } },
    },
  });
  if (!payment) return res.status(404).json({ error: 'Paiement introuvable' });
  return res.json(payment);
});

// PUT /api/payments/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { amount, method, status, date, label, appointmentId } = req.body;

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      amount: amount ? parseFloat(amount) : undefined,
      method,
      status,
      date: date ? new Date(date) : undefined,
      label,
      appointmentId: appointmentId || null,
    },
    include: {
      client: { select: { id: true, name: true } },
      appointment: { select: { id: true, type: true, date: true } },
    },
  });

  return res.json(payment);
});

// DELETE /api/payments/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.payment.delete({ where: { id } });
  return res.json({ message: 'Paiement supprimé' });
});

export default router;
