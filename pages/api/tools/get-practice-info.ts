import { NextApiRequest, NextApiResponse } from "next";

// Types for tool parameters
interface PracticeInfoParams {
  info_type?: 'hours' | 'pricing' | 'location' | 'services' | 'all';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { parameters } = req.body;
  console.log('Get practice info parameters:', parameters);

  try {
    const params = parameters as PracticeInfoParams;

    const practiceInfo = {
      hours: {
        monday: "9:00 AM - 6:00 PM",
        tuesday: "9:00 AM - 6:00 PM",
        wednesday: "9:00 AM - 6:00 PM",
        thursday: "9:00 AM - 6:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "9:00 AM - 2:00 PM",
        sunday: "Closed"
      },
      pricing: {
        initial_session: "$180",
        follow_up_session: "$150",
        concession_available: true
      },
      location: {
        address: "123 Mental Health Street, Sydney NSW 2000",
        parking: "Free parking available",
        public_transport: "5-minute walk from Central Station"
      },
      services: [
        "Mood disorders (depression, anxiety)",
        "Relationship issues",
        "Stress management",
        "Trauma therapy",
        "Cognitive Behavioral Therapy (CBT)"
      ]
    };

    let message = '';
    if (params.info_type === 'hours' || params.info_type === 'all') {
      message += `We're open Monday to Friday 9 AM to 6 PM, Saturday 9 AM to 2 PM, and closed Sundays. `;
    }
    if (params.info_type === 'pricing' || params.info_type === 'all') {
      message += `Initial sessions are $180 and follow-up sessions are $150. Concession rates are available. `;
    }
    if (params.info_type === 'location' || params.info_type === 'all') {
      message += `We're located at 123 Mental Health Street, Sydney, with free parking and easy access to public transport. `;
    }
    if (params.info_type === 'services' || params.info_type === 'all') {
      message += `We specialize in mood disorders, relationship issues, stress management, trauma therapy, and CBT. `;
    }

    const response = {
      success: true,
      info: practiceInfo,
      message: message || 'Here\'s our practice information. What would you like to know more about?'
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting practice info:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve practice information at the moment.'
    });
  }
}
