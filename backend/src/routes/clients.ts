import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/clients
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { search, status, page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { appointments: true, payments: true } },
      },
    }),
    prisma.client.count({ where }),
  ]);

  return res.json({ clients, total, page: parseInt(page), limit: parseInt(limit) });
});

// POST /api/clients
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { name, phone, email, source, status, notes } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Nom et téléphone requis' });
  }

  const client = await prisma.client.create({
    data: {
      name, phone, email, source, status, notes,
      assignedToId: req.userId,
    },
  });

  return res.status(201).json(client);
});

// GET /api/clients/:id
router.get('/:id', authenticate, async (_req: AuthRequest, res: Response) => {
  const { id } = _req.params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: { orderBy: { date: 'desc' } },
      payments: { orderBy: { date: 'desc' } },
    },
  });
  if (!client) return res.status(404).json({ error: 'Client introuvable' });
  return res.json(client);
});

// PUT /api/clients/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, phone, email, source, status, notes } = req.body;

  const client = await prisma.client.update({
    where: { id },
    data: { name, phone, email, source, status, notes },
  });

  return res.json(client);
});

// DELETE /api/clients/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.client.delete({ where: { id } });
  return res.json({ message: 'Client supprimé' });
});

export default router;
