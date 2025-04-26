export default async function handler(req, res) {
    try {
      const response = await fetch('https://nomorechores.launch27.com/api/v1/service_categories', {
        headers: {
          Authorization: `Bearer live_HoYzEJeICelB170xsLNO`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching service categories:', error);
      res.status(500).json({ error: 'Failed to fetch service categories' });
    }
  }
  