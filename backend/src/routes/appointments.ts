import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createMeetEvent } from '../services/googleCalendar';
import { sendAppointmentEmail } from '../services/email';

const router = Router();
const prisma = new PrismaClient();

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

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { clientId, date, duration, type, notes } = req.body;

  if (!clientId || !date || !type) {
    return res.status(400).json({ error: 'Client, date et type requis' });
  }

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return res.status(404).json({ error: 'Client introuvable' });
  }

  const appointmentDate = new Date(date);
  const appointmentDuration = duration || 60;

  let meetLink: string | null = null;
  try {
    meetLink = await createMeetEvent({
      summary: `Séance coaching — ${client.name}`,
      description: notes || undefined,
      startDateTime: appointmentDate,
      durationMinutes: appointmentDuration,
      attendeeEmail: client.email || undefined,
    });
  } catch (err) {
    console.error('Erreur Google Calendar (non bloquant):', err);
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId,
      date: appointmentDate,
      duration: appointmentDuration,
      type,
      notes,
      meetLink,
    },
    include: {
      client: { select: { id: true, name: true, phone: true } },
    },
  });

  if (client.email) {
    try {
      await sendAppointmentEmail({
        to: client.email,
        clientName: client.name,
        appointmentType: type,
        date: appointmentDate,
        meetLink,
      });
    } catch (err) {
      console.error('Erreur envoi email (non bloquant):', err);
    }
  }

  return res.status(201).json(appointment);
});

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

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await prisma.appointment.delete({ where: { id } });
  return res.json({ message: 'Rendez-vous supprimé' });
});

export default router;
