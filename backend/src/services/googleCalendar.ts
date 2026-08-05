import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export interface CreateMeetEventParams {
  summary: string;
  description?: string;
  startDateTime: Date;
  durationMinutes: number;
  attendeeEmail?: string;
}

export const createMeetEvent = async ({
  summary, description, startDateTime, durationMinutes, attendeeEmail,
}: CreateMeetEventParams): Promise<string | null> => {
  try {
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

    const event = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'none',
      requestBody: {
        summary,
        description,
        start: { dateTime: startDateTime.toISOString(), timeZone: 'Africa/Casablanca' },
        end: { dateTime: endDateTime.toISOString(), timeZone: 'Africa/Casablanca' },
        attendees: attendeeEmail ? [{ email: attendeeEmail }] : undefined,
        conferenceData: {
          createRequest: {
            requestId: `mmi-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    return event.data.hangoutLink || null;
  } catch (err) {
    console.error('Erreur création événement Google Calendar:', err);
    return null;
  }
};
