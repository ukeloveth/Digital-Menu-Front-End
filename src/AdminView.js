import './App.css'
import * as React from 'react';

import OrderView from './OrderView';
import QrcodeView from './QrcodeView'

  
const AdminView = ()=>{
  const [selectedOrder, setSelectedOrder] = React.useState(null);
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
