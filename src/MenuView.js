import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import './App.css';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Card } from '@mui/material';
import './Cart'
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Cart from './Cart';
import { orderAPI } from './api';

const MenuView = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      setError(null);

      const data = { page: 0, size: 100 };

      try {
        const res = await orderAPI.getMenu(data);
        const menus = res.data?.menus || res.data || [];
        
        if (Array.isArray(menus) && menus.length > 0) {
          setMenus(menus);
        }
      } catch (err) {
        console.error("API Error:", err);
        console.error("API Error response:", err.response);
        setError('Failed to fetch menus');
      } finally {
        setLoading(false);
      }
    };
    // Call the function when component mounts
    fetchMenuData();
  }, []);

  const handleAddToCart = (item) => {
    console.log(item, "Item to add to cart", cartItems);
    item.itemName = item.name;
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.name === item.name);
  
      if (existingItem) {
        return prevItems.map((i) =>
          i.name === item.name
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };
  const clearCart = () => {
    setCartItems([]);
  }

  const handleCardClick = (itemIndex, item) => {
    setSelectedCard(selectedCard === itemIndex ? null : itemIndex);
    handleAddToCart(item)
  };


  const handleDelete = (index) => {
    setCartItems((prevItems) => {
      const newCartItems = [...prevItems];
      newCartItems.splice(index, 1);
      return newCartItems;
    });
  };

  return (
    <div className='main-body'>
      <Cart cartItems={cartItems} handleDelete={handleDelete} clearCart={clearCart} />
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Typography>Loading menu...</Typography>
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <Typography>{error}</Typography>
        </div>
      )}
      
      {!loading && !error && menus.length > 0 && menus.map((menu, index) => (
        <div key={index}> 
          {menu && menu.categories.map((category, categoryIndex) => (
            <div  className='category-item' key={categoryIndex}>
            <Accordion  >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '5px' }}>
                  <h5 style={{ fontSize: '16px', margin: '0', fontWeight: 'bold', fontFamily: 'raleway' }}>{category.name}</h5>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {category.subCategories.map((subcategory, subIndex) => (
                  <Accordion key={subIndex}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-${subIndex}a-content`}
                      id={`panel${index}-${subIndex}a-header`}
                    >
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '5px' }}>
                        <h5 style={{ fontSize: '14px', margin: '0', fontWeight: 'bold', fontFamily: 'raleway' }}>{subcategory.name}</h5>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', }}>
          
                      {subcategory.menuItemList && subcategory.menuItemList.map((item, itemIndex) => (
                        <Card
                          key={itemIndex}
                          // className={selectedCard === itemIndex ? 'card-selected' : 'card'}
                          className='card'
                          onClick={() => handleCardClick(itemIndex,item)}
                        >
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', }}>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                              <h5 style={{ fontSize: '14px', margin: '0', fontWeight: 'bold', fontFamily: 'raleway' }}>{item.name}</h5>
                              <h6 style={{ fontSize: '12px', margin: '0', fontWeight: '400', fontFamily: 'raleway' }}>{item.price}</h6>
                            </div>
                            <h6 style={{ fontSize: '12px', margin: '0', fontWeight: '500', fontFamily: 'raleway', marginTop:'10px' }}>{item.description}</h6>
                      
                          </div>
                        </Card>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
            </div>
          ))}
        
        </div>
      ))}
      
    </div>
  );
};

export default MenuView;