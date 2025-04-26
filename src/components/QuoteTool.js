import { useState, useEffect } from 'react';

export default function QuoteTool() {
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('1');
  const [halfBathrooms, setHalfBathrooms] = useState('0');
  const [squareFootage, setSquareFootage] = useState('');
  const [squareFootageOptions, setSquareFootageOptions] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('');
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  useEffect(() => {
    if (serviceType) calculatePrice();
  }, [bedrooms, bathrooms, halfBathrooms, serviceType, squareFootage]);

  const fetchServiceCategories = async () => {
    try {
      const res = await fetch('/api/service-categories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log('Service Categories fetched:', data);
      setServiceCategories(data);

      if (data.length > 0) {
        setServiceType(data[0].id.toString());

        const sqftOptions = data[0].pricing_options.filter(opt =>
          opt.name.toLowerCase().includes('sqft')
        );
        setSquareFootageOptions(sqftOptions);

        if (sqftOptions.length > 0) {
          setSquareFootage(sqftOptions[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to fetch service categories', err);
    }
  };

  const handleServiceTypeChange = (e) => {
    const newServiceType = e.target.value;
    setServiceType(newServiceType);

    const selectedCategory = serviceCategories.find(
      cat => cat.id.toString() === newServiceType
    );
    if (selectedCategory) {
      const sqftOptions = selectedCategory.pricing_options.filter(opt =>
        opt.name.toLowerCase().includes('sqft')
      );
      setSquareFootageOptions(sqftOptions);
      if (sqftOptions.length > 0) {
        setSquareFootage(sqftOptions[0].id.toString());
      } else {
        setSquareFootage('');
      }
    }
  };

  const calculatePrice = () => {
    const selectedCategory = serviceCategories.find(
      cat => cat.id.toString() === serviceType
    );
    if (!selectedCategory) return;

    let basePrice = 0;

    if (selectedCategory.pricing_options && selectedCategory.pricing_options.length > 0) {
      const bedroomOption = selectedCategory.pricing_options.find(option =>
        option.name.toLowerCase().includes('bedroom') &&
        option.name.includes(bedrooms)
      );
      const sqftOption = selectedCategory.pricing_options.find(option =>
        option.id.toString() === squareFootage
      );

      if (sqftOption) {
        basePrice = sqftOption.price;
      } else if (bedroomOption) {
        basePrice = bedroomOption.price;
      } else {
        basePrice = selectedCategory.price || 0;
      }
    } else {
      basePrice = selectedCategory.price || 0;
    }

    const totalBaths = parseFloat(bathrooms) + parseFloat(halfBathrooms) * 0.5;
    const bathroomCharge = (totalBaths - 1) * (selectedCategory.bathroom_price || 0);

    const total = basePrice + (bathroomCharge > 0 ? bathroomCharge : 0);
    setPrice(total.toFixed(2));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div>
        <label>Service Category</label>
        <select
          value={serviceType}
          onChange={handleServiceTypeChange}
          className="border rounded p-2 w-full"
        >
          {serviceCategories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Square Footage</label>
        <select
          value={squareFootage}
          onChange={e => setSquareFootage(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {squareFootageOptions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Bedrooms</label>
        <select
          value={bedrooms}
          onChange={e => setBedrooms(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="0">Studio</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4 Bedrooms</option>
          <option value="5">5 Bedrooms</option>
        </select>
      </div>

      <div>
        <label>Full Bathrooms</label>
        <select
          value={bathrooms}
          onChange={e => setBathrooms(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="1">1 Bathroom</option>
          <option value="1.5">1.5 Bathrooms</option>
          <option value="2">2 Bathrooms</option>
          <option value="2.5">2.5 Bathrooms</option>
          <option value="3">3 Bathrooms</option>
        </select>
      </div>

      <div>
        <label>Half Bathrooms</label>
        <select
          value={halfBathrooms}
          onChange={e => setHalfBathrooms(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="0">0 Half Bathroom</option>
          <option value="1">1 Half Bathroom</option>
          <option value="2">2 Half Bathrooms</option>
        </select>
      </div>

      <div>
        <label>Calculated Price</label>
        <div className="p-2 border rounded">${price}</div>
      </div>
    </div>
  );
}
