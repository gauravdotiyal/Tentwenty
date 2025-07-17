import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { TimesheetEntry } from '@/types';
import { authOptions } from '../auth/[...nextauth]';

// Dummy data for demonstration
const timesheetEntries: TimesheetEntry[] = [
  {
    id: '1',
    weekNumber: 1,
    date: '2024-01-01',
    status: 'COMPLETED',
  },
  {
    id: '2',
    weekNumber: 2,
    date: '2024-01-08',
    status: 'COMPLETED',
  },
  {
    id: '3',
    weekNumber: 3,
    date: '2024-01-15',
    status: 'INCOMPLETE',
  },
  {
    id: '4',
    weekNumber: 4,
    date: '2024-01-22',
    status: 'COMPLETED',
  },
  {
    id: '5',
    weekNumber: 5,
    date: '2024-01-29',
    status: 'MISSING',
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(timesheetEntries);

      case 'POST':
        const newEntry: TimesheetEntry = {
          id: String(timesheetEntries.length + 1),
          ...req.body,
        };
        timesheetEntries.push(newEntry);
        return res.status(201).json(newEntry);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 