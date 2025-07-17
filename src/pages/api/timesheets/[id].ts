import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { TimesheetEntry } from '@/types';
import { authOptions } from '../auth/[...nextauth]';

// This would be replaced with a database in a real application
let timesheetEntries: TimesheetEntry[] = [
  {
    id: '1',
    weekNumber: 1,
    date: '2024-01-01',
    status: 'approved',
  },
  {
    id: '2',
    weekNumber: 2,
    date: '2024-01-08',
    status: 'pending',
  },
  {
    id: '3',
    weekNumber: 3,
    date: '2024-01-15',
    status: 'rejected',
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

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    switch (req.method) {
      case 'PUT':
        const updateData = req.body;
        const entryIndex = timesheetEntries.findIndex(entry => entry.id === id);

        if (entryIndex === -1) {
          return res.status(404).json({ error: 'Entry not found' });
        }

        timesheetEntries[entryIndex] = {
          ...timesheetEntries[entryIndex],
          ...updateData,
        };

        return res.status(200).json(timesheetEntries[entryIndex]);

      case 'DELETE':
        const initialLength = timesheetEntries.length;
        timesheetEntries = timesheetEntries.filter(entry => entry.id !== id);

        if (timesheetEntries.length === initialLength) {
          return res.status(404).json({ error: 'Entry not found' });
        }

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 