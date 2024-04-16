import React, { useState, useEffect } from 'react';
import './App.css';
import { customers } from './customerData';
import { Customer } from './types';

const App: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (selectedCustomer) {
        fetchPhotos(selectedCustomer.id);
      }
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [selectedCustomer]);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchPhotos(customer.id);
  };

  const fetchPhotos = async (customerId: number) => {
    try {
      // Generate a random page number between 1 and 100 (assuming there are at most 100 pages of curated photos)
      const randomPage = Math.floor(Math.random() * 100) + 1;
      const response = await fetch(`https://api.pexels.com/v1/curated?per_page=9&page=${randomPage}&size=large`, {
        headers: {
          'Authorization': 'rUYbzfem9pYBr454k2B9uTVIDgjWyTmyOs96QYgAeTJTUfdwJibzv8aO'
        }
      });
      const data = await response.json();
      console.log('API Response:', data);
      const photos = data.photos.map((photo: any) => photo.src.large2x); // Use large2x for better clarity
      console.log('Photos:', photos);
      setSelectedCustomer(prevCustomer => {
        if (prevCustomer && prevCustomer.id === customerId) {
          return { ...prevCustomer, photos };
        }
        return prevCustomer;
      });
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };
  
  return (
    <div>
    <header className="app-header">
      <h1>Customer Portal</h1>
    </header>
    <div className="app-container">
      <div className="customer-list">
        <ul>
          {customers.map(customer => (
            <li
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              className={selectedCustomer?.id === customer.id ? 'selected' : ''}
            >
              <div>
                <span>Customer {customer.id}</span><br/>
                
                <strong>{customer.name}</strong><br/>
                <span>{customer.title}</span>
                
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="customer-details">
        
        {selectedCustomer ? (
          
          <div>
            <h2>Customer {selectedCustomer.id} Details</h2> 
            <p><strong>Name:</strong> {selectedCustomer.name}</p>
            <p><strong>Title:</strong> {selectedCustomer.title}</p>
            <p><strong>Address:</strong> {selectedCustomer.address}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            
            <div className="photo-grid">
              {selectedCustomer.photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Photo ${index + 1}`} />
              ))}
            </div>
          </div>
        ) : (
          // If no customer is selected, display a message
          <p>Please select a customer</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default App;
