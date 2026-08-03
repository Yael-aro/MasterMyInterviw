import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const email = process.env.ADMIN_EMAIL || 'admin@mastermyinterview.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const name = process.env.ADMIN_NAME || 'Yassine El Arousy';

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { email, password: hashedPassword, name, role: 'ADMIN' },
    });
    console.log(`✅ Admin créé : ${email}`);
  } else {
    console.log(`ℹ️  Admin déjà existant : ${email}`);
  }

  // Seed demo clients
  const demoClients = [
    { name: 'Karim Benali', phone: '+212 6 12 34 56 78', email: 'karim.benali@gmail.com', source: 'LINKEDIN', status: 'IN_PREP' },
    { name: 'Salma Idrissi', phone: '+212 6 98 76 54 32', email: 'salma.idrissi@hotmail.com', source: 'WHATSAPP', status: 'PROSPECT' },
    { name: 'Mehdi Tazi', phone: '+212 6 55 44 33 22', source: 'REFERRAL', status: 'INTERVIEWED' },
    { name: 'Nadia El Mansouri', phone: '+212 6 11 22 33 44', email: 'nadia.elmansouri@gmail.com', source: 'LINKEDIN', status: 'PLACED' },
  ];

  const adminUser = await prisma.user.findUnique({ where: { email } });

  for (const clientData of demoClients) {
    const existing = await prisma.client.findFirst({ where: { phone: clientData.phone } });
    if (!existing) {
      const client = await prisma.client.create({
        data: { ...clientData, assignedToId: adminUser!.id },
      });

      // Add demo appointments
      const apptDate = new Date();
      apptDate.setDate(apptDate.getDate() + Math.floor(Math.random() * 14) + 1);
      apptDate.setHours(10 + Math.floor(Math.random() * 6), 0, 0, 0);

      await prisma.appointment.create({
        data: {
          clientId: client.id,
          date: apptDate,
          duration: 60,
          type: ['ONLINE_COACHING', 'MOCK_INTERVIEW', 'CV_OPTIM', 'HR_PREP'][Math.floor(Math.random() * 4)],
          status: 'SCHEDULED',
        },
      });

      // Add demo payment
      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: [500, 800, 1200][Math.floor(Math.random() * 3)],
          method: ['TRANSFER', 'CASH', 'WHATSAPP'][Math.floor(Math.random() * 3)],
          status: clientData.status === 'PLACED' ? 'PAID' : 'PENDING',
          label: 'Séance coaching individuelle',
          date: new Date(),
        },
      });
    }
  }

  console.log('✅ Seeding terminé !');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
