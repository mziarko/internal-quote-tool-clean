// pages/api/service-categories.js

export default async function handler(req, res) {
    try {
      const response = await fetch('https://nomorechores.launch27.com/api/v1/service_categories', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LAUNCH27_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`Launch27 API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching service categories:', error);
      res.status(500).json({ message: 'Failed to fetch service categories' });
    }
  }
  