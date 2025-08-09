import React, { useState } from 'react';
import './App.css'
import { Button } from '@mui/material';
import { MoreHorizOutlined } from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Delete } from '@mui/icons-material';
import { formatPrice, getTimeAgo } from './utils';
import { orderAPI } from './api';
import dayjs from 'dayjs';



function createData(tableNumber, meals, orderAt, totalPrice, status) {
    return { tableNumber, meals, orderAt, totalPrice, status };
  }
  
const ViewOrder = (props) => {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [activeRow, setActiveRow] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const itemCount = selectedOrder && selectedOrder.items ? selectedOrder.items.reduce((total, item) => total + (item.quantity || 0), 0) : 0;

  const calculateTotalPrice = () => {
    if(selectedOrder && selectedOrder.items){
        return selectedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    return 0;
  };
  const open = Boolean(anchorEl);

  React.useEffect(() => {
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
        setError('Failed to fetch menus');
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
      setError(`Failed to  order`);
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
  
  return (
    <div className='admin-container'>
    <div className='view-order'>
      <p className='cart-header'>View Order</p>
      <div className='cart-item-header'>
      <p className='cart-item-name'><b>Name </b></p>
       <p className='cart-item-quatity'><b>Quantity</b></p>
       <p className='cart-item-price'><b>Price: &#163;</b></p>
      </div>
      {selectedOrder && selectedOrder.items ? selectedOrder.items.map((item, index) => (
     <div className='cart-item' key={index}>
       <p className='cart-item-name'>{item.itemName}</p>
       <p className='cart-item-quatity'>{item.quantity}</p>
       <p className='cart-item-price'>{formatPrice(item.price)}</p>

     </div>
      )) : null}
      <hr style={{width: '100%', height: '1px', border:'none', backgroundColor:'gray'}}/>
      <div className='cart-item'>
         <p className='cart-item-name'>Table Number: {selectedOrder ? selectedOrder.tableNumber : ''}</p>
         <p className='cart-item-quatity'>{selectedOrder ? selectedOrder.orderAt : ''}</p>
         <p className='cart-item-quatity'>{selectedOrder ? selectedOrder.status : ''}</p>
      </div>
      <hr style={{width: '100%', height: '1px', border:'none', backgroundColor:'gray'}}/>
      <div className='cart-submit-order'>
      <p className='cart-total-amount'>Total: &#163;{formatPrice(calculateTotalPrice())}</p>
      <Button 
        variant='text' 
        className={hasItems && selectedOrder && selectedOrder.status === 'pending'? 'cart-submit-order-btn' : 'cart-submit-order-btn-disabled'} 
        onClick={submitOrder} 
        disabled={!hasItems && selectedOrder && selectedOrder.status !== 'pending'}>
        Complete
      </Button>
      </div>
    </div>

     
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: '90%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Table Number</TableCell>
            <TableCell align="left">Item (s)</TableCell>
            <TableCell align="left">OrderedAt</TableCell>
            <TableCell align="left">TotalPrice</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">
              
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders && orders.map((order, index) => (
            <TableRow
              key={`${order.tableNumber}-${index}`}
              onClick={() => handleSetSelectedOrder(order)}>
              <TableCell align="left">{order.tableNumber}</TableCell>
              <TableCell align="left">{order.items.length}</TableCell>
              <TableCell align="left">{getTimeAgo(order.orderedAt)}</TableCell>
              <TableCell align="left">{formatPrice(order.totalPrice)}</TableCell>
              <TableCell align="left">{order.status}</TableCell>
              
              <TableCell align="right">
              <Button
                id={`basic-button-${index}`}
                aria-controls={open && activeRow === index ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open && activeRow === index ? 'true' : undefined}
                onClick={(event) => handleClick(event, index)}
              >
                <MoreHorizOutlined />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open && activeRow === index}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': `basic-button-${index}`,
                }}
                style={{display : order.status === 'pending' ? 'flex':'none'}}>
                <MenuItem onClick={()=>handleOrderStatus(order,"complete")}>Complete</MenuItem>
                <MenuItem onClick={()=>handleOrderStatus(order,"cancel")}>Cancel</MenuItem>
              </Menu>
              </TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default ViewOrder;