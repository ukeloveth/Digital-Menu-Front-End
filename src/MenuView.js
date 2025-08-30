import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import './App.css';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Card, CardContent, Typography, Box, Chip, Skeleton, Alert, Fade, Zoom } from '@mui/material';
import './Cart'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
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

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return price;
    }
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  const renderLoadingSkeleton = () => (
    <Box sx={{ width: '100%', padding: 2 }}>
      {[1, 2, 3].map((item) => (
        <Box key={item} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[1, 2, 3].map((card) => (
              <Skeleton key={card} variant="rectangular" width={200} height={120} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <div className='main-body'>
      <Cart cartItems={cartItems} handleDelete={handleDelete} clearCart={clearCart} />
      
      {loading && renderLoadingSkeleton()}
      
      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        </Fade>
      )}
      
      {!loading && !error && menus.length > 0 && (
        <Box sx={{ width: '100%' }}>
          {menus.map((menu, index) => (
            <div key={index}> 
              {menu && menu.categories.map((category, categoryIndex) => (
                <div className='category-item' key={categoryIndex}>
                  <Accordion className='accordion-shadow enhanced-accordion'>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#6dee7e' }} />}
                      aria-controls={`panel${index}a-content`}
                      id={`panel${index}a-header`}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(109, 238, 126, 0.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        padding: '8px 0'
                      }}>
                        <RestaurantIcon sx={{ color: '#6dee7e', fontSize: 24 }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            fontFamily: 'Raleway',
                            color: '#2c3e50'
                          }}
                        >
                          {category.name}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '16px 24px' }}>
                      {category.subCategories.map((subcategory, subIndex) => (
                        <Accordion className='accordion-shadow sub-accordion' key={subIndex}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#6dee7e', fontSize: 20 }} />}
                            aria-controls={`panel${index}-${subIndex}a-content`}
                            id={`panel${index}-${subIndex}a-header`}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(109, 238, 126, 0.03)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Box sx={{ 
                              width: '100%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2,
                              padding: '4px 0'
                            }}>
                              <LocalDiningIcon sx={{ color: '#6dee7e', fontSize: 20 }} />
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 600, 
                                  fontFamily: 'Raleway',
                                  color: '#34495e'
                                }}
                              >
                                {subcategory.name}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            flexWrap: 'wrap', 
                            gap: 2,
                            padding: '16px 24px'
                          }}>
                            {subcategory.menuItemList && subcategory.menuItemList.map((item, itemIndex) => (
                              <Zoom in={true} style={{ transitionDelay: `${itemIndex * 100}ms` }} key={itemIndex}>
                                <Card
                                  className='enhanced-card'
                                  onClick={() => handleCardClick(itemIndex, item)}
                                  sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    },
                                    '&:active': {
                                      transform: 'translateY(-2px)',
                                    }
                                  }}
                                >
                                  <CardContent sx={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'flex-start',
                                      mb: 1
                                    }}>
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          fontWeight: 700, 
                                          fontFamily: 'Raleway',
                                          color: '#2c3e50',
                                          fontSize: '1rem',
                                          lineHeight: 1.2,
                                          flex: 1,
                                          mr: 1
                                        }}
                                      >
                                        {item.name}
                                      </Typography>
                                      <Chip 
                                        label={formatPrice(item.price)} 
                                        sx={{ 
                                          backgroundColor: '#6dee7e',
                                          color: 'white',
                                          fontWeight: 600,
                                          fontSize: '0.875rem',
                                          minWidth: '60px'
                                        }}
                                      />
                                    </Box>
                                    {item.description && (
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 400, 
                                          fontFamily: 'Raleway',
                                          color: '#7f8c8d',
                                          fontSize: '0.875rem',
                                          lineHeight: 1.4,
                                          mt: 1,
                                          flex: 1
                                        }}
                                      >
                                        {item.description}
                                      </Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              </Zoom>
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
        </Box>
      )}
      
      {!loading && !error && menus.length === 0 && (
        <Fade in={true}>
          <Box sx={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#7f8c8d'
          }}>
            <RestaurantIcon sx={{ fontSize: 64, color: '#bdc3c7', mb: 2 }} />
            <Typography variant="h6" sx={{ fontFamily: 'Raleway', fontWeight: 500 }}>
              No menu items available
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'Raleway', mt: 1 }}>
              Please check back later or contact support if this persists.
            </Typography>
          </Box>
        </Fade>
      )}
    </div>
  );
};

export default MenuView;