import React, { useState, useEffect } from 'react';
import './App.css'
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Divider,
  Alert,
  Fade,
  Zoom,
  Skeleton
} from '@mui/material';
import { 
  MoreHorizOutlined, 
  Receipt, 
  TableRestaurant, 
  AccessTime,
  CheckCircle,
  Cancel,
  PendingActions,
  Restaurant
} from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { formatPrice, getTimeAgo } from './utils';
import { orderAPI } from './api';
import dayjs from 'dayjs';

const ViewOrder = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateTotalPrice = () => {
    if(selectedOrder && selectedOrder.items){
        return selectedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    return 0;
  };
  
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      const data = { page: 0, size: 100 };

      try {
        const res = await orderAPI.getOrders(data);
        const orders = res.data?.orders || res.data || [];
        console.log(orders, "Response for orders")
        
        if (Array.isArray(orders) && orders.length > 0) {
          orders.sort((a, b) => {
            return dayjs(b.orderedAt).isBefore(dayjs(a.orderedAt)) ? -1 : 1;
          });
          setOrders(orders);
        }
      } catch (err) {
        console.error("API Error:", err);
        console.error("API Error response:", err.response);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
     fetchOrderData()
  }, [])
  
  const submitOrder = async () =>{
    if(selectedOrder.status === "pending"){
      setLoading(true)
    let data = {}
    data.orderId = selectedOrder.id
    try {
      const res = await orderAPI.completeOrder(data);
        const resData = res.data;
        console.log(resData, "Response for complete order")
        if (resData.status === "successful") {
          alert(resData.detail)
          const updatedOrders = orders.map(ord => 
            ord.id === selectedOrder.id ? { ...ord, status: 'COMPLETED' } : ord
          );
          setSelectedOrder(null);
          setOrders(updatedOrders);
        
        }
    }
    catch (err) {
      console.error("API Error:", err);
      console.error("API Error response:", err.response);
      setError(`Failed to complete order`);
    } finally {
      setLoading(false);
    }
  }
  }
  
  const handleClick = (event, rowIndex) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(rowIndex);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  const handleOrderStatus = async (order, type) =>{
    setLoading(true)
    let data = {}
    data.orderId = order.id
    try {
      if(type === "cancel"){
        const res = await orderAPI.cancelOrder(data);
        const resData = res.data;
        console.log(resData, "Response for cancel order")
        if (resData.status === "successful") {
          alert(resData.detail)
          // Refresh orders list after successful update
          const updatedOrders = orders.map(ord => 
            ord.id === order.id ? { ...ord, status: 'cancel' } : ord
          );
          setOrders(updatedOrders);
        }
      }
      else if(type === "complete"){
        const res = await orderAPI.completeOrder(data);
        const resData = res.data;
        console.log(resData, "Response for complete order")
        if (resData.status === "successful") {
          alert(resData.detail)
          // Refresh orders list after successful update
          const updatedOrders = orders.map(ord => 
            ord.id === order.id ? { ...ord, status: 'completed' } : ord
          );
          setOrders(updatedOrders);
        }
      }
      
    } catch (err) {
      console.error("API Error:", err);
      console.error("API Error response:", err.response);
      setError(`Failed to ${type} order`);
    } finally {
      setLoading(false);
      handleClose(); // Close the menu after operation
    }
  }
  
  const handleSetSelectedOrder = (order) => {
      setSelectedOrder(order);
  };
  
  const hasItems = selectedOrder && selectedOrder.items && selectedOrder.items.length > 0;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle sx={{ color: '#27ae60' }} />;
      case 'cancel':
        return <Cancel sx={{ color: '#e74c3c' }} />;
      case 'pending':
        return <PendingActions sx={{ color: '#f39c12' }} />;
      default:
        return <Restaurant sx={{ color: '#7f8c8d' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#27ae60';
      case 'cancel':
        return '#e74c3c';
      case 'pending':
        return '#f39c12';
      default:
        return '#7f8c8d';
    }
  };

  const renderOrderDetails = () => (
    <Zoom in={true}>
      <Card sx={{ 
        mb: 3,
        borderRadius: 3,
        border: '1px solid rgba(109, 238, 126, 0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            pb: 2,
            borderBottom: '2px solid rgba(109, 238, 126, 0.1)'
          }}>
            <Receipt sx={{ color: '#6dee7e', fontSize: 28 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                fontFamily: 'Raleway',
                color: '#2c3e50'
              }}
            >
              Order Details
            </Typography>
          </Box>

          {/* Order Items */}
          {selectedOrder && selectedOrder.items ? (
            <Box sx={{ mb: 3 }}>
              {selectedOrder.items.map((item, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                    mb: 1,
                    backgroundColor: 'rgba(109, 238, 126, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(109, 238, 126, 0.1)'
                  }}
                >
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        fontFamily: 'Raleway',
                        color: '#2c3e50',
                        mb: 0.5
                      }}
                    >
                      {item.itemName}
                    </Typography>
                    <Chip 
                      label={`Qty: ${item.quantity}`}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(109, 238, 126, 0.1)',
                        color: '#6dee7e',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#6dee7e',
                      fontFamily: 'Raleway'
                    }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 3,
              color: '#7f8c8d'
            }}>
              <Restaurant sx={{ fontSize: 48, color: '#bdc3c7', mb: 2 }} />
              <Typography variant="h6" sx={{ fontFamily: 'Raleway', fontWeight: 500 }}>
                No order selected
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Raleway' }}>
                Select an order from the table below to view details
              </Typography>
            </Box>
          )}

          {/* Order Summary */}
          {selectedOrder && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableRestaurant sx={{ color: '#6dee7e' }} />
                  <Typography variant="body1" sx={{ fontFamily: 'Raleway', fontWeight: 600 }}>
                    Table {selectedOrder.tableNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: '#6dee7e' }} />
                  <Typography variant="body2" sx={{ fontFamily: 'Raleway', color: '#7f8c8d' }}>
                    {selectedOrder.orderAt}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(selectedOrder.status)}
                  <Typography variant="body1" sx={{ fontFamily: 'Raleway', fontWeight: 600 }}>
                    Status: {selectedOrder.status}
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800, 
                    fontFamily: 'Raleway',
                    color: '#6dee7e'
                  }}
                >
                  Total: £{formatPrice(calculateTotalPrice())}
                </Typography>
              </Box>

              {/* Complete Button */}
              {hasItems && selectedOrder && selectedOrder.status === 'pending' && (
                <Button 
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={submitOrder} 
                  disabled={loading}
                  sx={{
                    backgroundColor: '#6dee7e',
                    color: 'white',
                    fontWeight: 700,
                    fontFamily: 'Raleway',
                    fontSize: '1.1rem',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#5dd86e',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(109, 238, 126, 0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: '#bdc3c7',
                      transform: 'none',
                      boxShadow: 'none',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  startIcon={loading ? <Skeleton variant="circular" width={20} height={20} /> : <CheckCircle />}
                >
                  {loading ? 'Processing...' : 'Complete Order'}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );

  const renderOrdersTable = () => (
    <Card sx={{ 
      borderRadius: 3,
      border: '1px solid rgba(109, 238, 126, 0.1)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3, 
          pb: 2,
          borderBottom: '1px solid rgba(109, 238, 126, 0.1)',
          backgroundColor: 'rgba(109, 238, 126, 0.02)'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              fontFamily: 'Raleway',
              color: '#2c3e50'
            }}
          >
            All Orders
          </Typography>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: '100%' }} aria-label="orders table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(109, 238, 126, 0.05)' }}>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Table</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders && orders.map((order, index) => (
                <TableRow
                  key={`${order.tableNumber}-${index}`}
                  onClick={() => handleSetSelectedOrder(order)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(109, 238, 126, 0.05)',
                    },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableRestaurant sx={{ color: '#6dee7e', fontSize: 20 }} />
                      <Typography sx={{ fontFamily: 'Raleway', fontWeight: 600 }}>
                        {order.tableNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${order.items.length} items`}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(109, 238, 126, 0.1)',
                        color: '#6dee7e',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ color: '#6dee7e', fontSize: 16 }} />
                      <Typography sx={{ fontFamily: 'Raleway' }}>
                        {getTimeAgo(order.orderedAt)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ 
                      fontFamily: 'Raleway', 
                      fontWeight: 700,
                      color: '#6dee7e'
                    }}>
                      £{formatPrice(order.totalPrice)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status}
                      size="small"
                      icon={getStatusIcon(order.status)}
                      sx={{ 
                        backgroundColor: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        fontWeight: 600,
                        border: `1px solid ${getStatusColor(order.status)}40`
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      id={`basic-button-${index}`}
                      aria-controls={open && activeRow === index ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open && activeRow === index ? 'true' : undefined}
                      onClick={(event) => handleClick(event, index)}
                      sx={{
                        color: '#6dee7e',
                        '&:hover': {
                          backgroundColor: 'rgba(109, 238, 126, 0.1)',
                        }
                      }}
                    >
                      <MoreHorizOutlined />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open && activeRow === index}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': `basic-button-${index}`,
                      }}
                      sx={{ display: order.status === 'pending' ? 'flex' : 'none' }}
                    >
                      <MenuItem onClick={() => handleOrderStatus(order, "complete")}>
                        <CheckCircle sx={{ mr: 1, color: '#27ae60' }} />
                        Complete
                      </MenuItem>
                      <MenuItem onClick={() => handleOrderStatus(order, "cancel")}>
                        <Cancel sx={{ mr: 1, color: '#e74c3c' }} />
                        Cancel
                      </MenuItem>
                    </Menu>
                  </TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className='admin-container'>
      {/* Error Display */}
      {error && (
        <Fade in={true}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Order Details */}
      {renderOrderDetails()}

      {/* Orders Table */}
      {renderOrdersTable()}
    </div>
  );
};

export default ViewOrder;