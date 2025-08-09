import './App.css'
import * as React from 'react';


import OrderView from './OrderView';
import QrcodeView from './QrcodeView'
import { orderAPI } from './api';
import { formatPrice, getTimeAgo } from './utils';


function createData(tableNumber, meals, orderAt, totalPrice, status) {
    return { tableNumber, meals, orderAt, totalPrice, status };
  }
  
  const rows = [
    createData('2' ,[
      {name:"Eba",quantity:4, price:300},
      {name:"Rice",quantity:8, price:700},
      {name:"Beans",quantity:4, price:1200},
    ], 
      '2:00 pm', 2400, 'pending'),
    createData('6' ,[
      {name:"Eba",quantity:4, price:300},
      {name:"Rice",quantity:12, price:700},
      {name:"Beans",quantity:4, price:1600},
    ], '2:30 pm', 2900, 'cancel'),
    createData('9' ,[
      {name:"Eba",quantity:4, price:300},
      {name:"Rice",quantity:8, price:7000},
      {name:"Beans",quantity:40, price:1200},
    ], '1:30 pm', 7800, 'completed'),
  ];
const AdminView = ()=>{
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [activeRow, setActiveRow] = React.useState(null);
  const [orders, setOrders] = React.useState([]);

  
  
  
  
  
  return (
    <div className='main-body'>
      <p className="admin-header" style={{alignSelf:'flex-start'}}>Welcome to Back Office</p>
      <div className='admin-top-section-container'>
         <QrcodeView></QrcodeView>
         <OrderView selectedOrder={selectedOrder} orders={orders} setOrders={setOrders} setSelectedOrder={setSelectedOrder} />
      </div>
   </div>
  )
}
export default AdminView;
