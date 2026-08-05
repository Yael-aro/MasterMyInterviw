import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const VALID_APPOINTMENT_TYPES = [
  'ONLINE_COACHING', 'TECH_PREP', 'HR_PREP', 'COMM_PREP',
  'MOCK_INTERVIEW', 'CV_OPTIM', 'LINKEDIN_OPTIM',
];

// POST /api/public/booking — accessible sans authentification
router.post('/booking', async (req: Request, res: Response) => {
  const { name, phone, email, appointmentType, preferredPeriod, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Nom et téléphone requis' });
  }

  const type = VALID_APPOINTMENT_TYPES.includes(appointmentType) ? appointmentType : 'ONLINE_COACHING';

  try {
    const client = await prisma.client.create({
      data: {
        name,
        phone,
        email: email || undefined,
        source: 'WEBSITE',
        status: 'PROSPECT',
        notes: message || undefined,
      },
    });

    // Date placeholder — pas de calendrier de créneaux pour l'instant,
    // Yassine confirme la vraie date/heure depuis l'admin panel.
    const placeholderDate = new Date();
    placeholderDate.setDate(placeholderDate.getDate() + 3);
    placeholderDate.setHours(10, 0, 0, 0);

    const noteParts: string[] = ['⚠️ Réservation via le site — à confirmer avec le client'];
    if (preferredPeriod) noteParts.unshift(`Période souhaitée : ${preferredPeriod}`);

    await prisma.appointment.create({
      data: {
        clientId: client.id,
        date: placeholderDate,
        type,
        status: 'SCHEDULED',
        notes: noteParts.join(' — '),
      },
    });

    return res.status(201).json({ success: true, message: 'Réservation enregistrée' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur lors de la réservation' });
  }
});

export default router;