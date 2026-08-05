import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  ONLINE_COACHING: 'Coaching en ligne',
  TECH_PREP: 'Préparation technique',
  HR_PREP: 'Préparation RH',
  COMM_PREP: 'Préparation communication',
  MOCK_INTERVIEW: "Simulation d'entretien",
  CV_OPTIM: 'Optimisation CV',
  LINKEDIN_OPTIM: 'Optimisation LinkedIn',
};

export interface SendAppointmentEmailParams {
  to: string;
  clientName: string;
  appointmentType: string;
  date: Date;
  meetLink: string | null;
}

export const sendAppointmentEmail = async ({
  to, clientName, appointmentType, date, meetLink,
}: SendAppointmentEmailParams) => {
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  });
  const typeLabel = APPOINTMENT_TYPE_LABELS[appointmentType] || appointmentType;

  const meetSection = meetLink
    ? `<p style="margin: 24px 0;">
         <a href="${meetLink}" style="background:#C9A227;color:#0E0E0E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
           Rejoindre la visio
         </a>
       </p>
       <p style="color:#8A8680;font-size:13px;">Lien direct : ${meetLink}</p>`
    : '<p>Le lieu ou lien de la séance te sera communiqué séparément.</p>';

  await transporter.sendMail({
    from: `"Master My Interview" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Confirmation de ton rendez-vous — ${formattedDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background:#0E0E0E; color:#F0EAD6; padding:32px; border-radius:12px;">
        <h2 style="color:#C9A227;">Ton rendez-vous est confirmé</h2>
        <p>Bonjour ${clientName},</p>
        <p>Ta séance <strong>${typeLabel}</strong> est confirmée pour le :</p>
        <p style="font-size:18px; margin: 16px 0;">
          📅 ${formattedDate}<br/>
          🕐 ${formattedTime}
        </p>
        ${meetSection}
        <p style="margin-top:32px; color:#8A8680; font-size:13px;">
          Master My Interview · Yassine El Arousy
        </p>
      </div>
    `,
  });
};
