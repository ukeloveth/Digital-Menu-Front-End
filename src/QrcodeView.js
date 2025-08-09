import './App.css'
import * as React from 'react';
import { Button, TextField } from '@mui/material';
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
import {getTimeAgo} from './utils'
import { orderAPI } from './api';
// import printJS from 'print-js';
import dayjs from 'dayjs';


const QrcodeView = () => {
    const [qrcodes, setQrcodes] = React.useState([]);
    const [activeRow, setActiveRow] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [tableNumber, setTableNumber] = React.useState('')
    // const [printData, setPrintData] = React.useState(null);
    const open = Boolean(anchorEl);

    // const handlePrint = () => {
    //   if (printData) {
    //     printJS({
    //       printable: printData,
    //       type: 'image',
    //       style: `
    //         @media print {
    //           body { margin: 0; padding: 20px; text-align: center; }
    //           img { max-width: 100%; height: auto; }
    //         }
    //       `
    //     });
    //   }
    // };

        const fetchQrcodeData = async () => {
      setLoading(true);
      setError(null);
      const data = { page: 0, size: 100 };

      try {
        const res = await orderAPI.getAllQrcodes(data);
        const qrcodes = res.data;
        console.log(res.data, "Response for qrcodes")
       
        if (Array.isArray(qrcodes) && qrcodes.length > 0) {
          qrcodes.sort((a, b) => {
            return dayjs(b.createdAt).isBefore(dayjs(a.createdAt)) ? -1 : 1;
          });
          console.log(qrcodes, "after sorting")
          setQrcodes(qrcodes);
        }
      } catch (err) {
        console.error("API Error:", err);
        console.error("API Error response:", err.response);
        setError('Failed to fetch menus');
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      fetchQrcodeData();
    }, [])


    function displayAndDownloadBase64Image(base64String, fileName = "image.png") {
      // ✅ Display image in the browser
      const img = new Image();
      img.src = `data:image/png;base64,${base64String.qrCodeBase64}`;
      img.alt = "Decoded Base64 Image";
      img.style.maxWidth = "300px";
      img.style.display = "block";
      img.style.margin = "10px 0";
      document.body.appendChild(img);
    
      // ✅ Trigger automatic download
      const link = document.createElement("a");
      link.download = fileName;
      link.href = img.src;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    const handleGenerateQrcode = async() =>{
      setLoading(true);
      if (!tableNumber) {
        alert("Enter table number to proceed");
        return;
      }
      let data = {}
      data.tableNumber = tableNumber;
      data.menuUrl = window.location.origin
      try {
        await orderAPI.generateQrcode(data);
        
        await fetchQrcodeData();
        setTableNumber('')
      }
      catch (err) {
        console.error("API Error:", err);
        console.error("API Error response:", err.response);
        setError(`Failed to  order`);
      } finally {
        setLoading(false);
      }
    }

    const handleClick = (event, rowIndex) => {
        setAnchorEl(event.currentTarget);
        setActiveRow(rowIndex);
      };
      const handleChange = (event) => {
        setTableNumber(event.target.value); // Get value from the TextField
      };
      
      const handleClose = () => {
        setAnchorEl(null);
        setActiveRow(null);
      };
    return (
        <div className='admin-container' style={{justifyContent:'flex-start', alignItems:'flex-start'}}>
         <p className='cart-header'>Generate Table QR-Code</p>
          <div className='admin-top-section-input-container' style={{padding: '2rem 0'}}>
            <div className='section-input-container'>
             <TextField style={{width:'90%'}} 
             label='Table Number' variant='outlined' onChange={handleChange} value={tableNumber}></TextField>
            </div>
            <div className='section-input-container' style={{justifyContent:'flex-end'}}>
            <Button 
              onClick={handleGenerateQrcode}
              variant='text' 
              className='admin-top-section-input-btn'>
              {loading ? 'Loading ...' : 'Generate'}
            </Button>
            </div>
          </div>
         

     <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Table Number</TableCell>
            <TableCell align="left">code</TableCell>
            <TableCell align="left">Created At</TableCell>
            <TableCell align="right">
              
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qrcodes && qrcodes.map((order, index) => (
            <TableRow
              key={`${order.tableNumber}-${index}`}
              >
              <TableCell align="left">{order.tableNumber}</TableCell>
              <TableCell align="left">{order.qrCodeBase64.substring(0,9)}</TableCell>
              <TableCell align="left">{getTimeAgo(order.createdAt)}</TableCell>
              
              <TableCell align="right">
              <Button
                id={`basic-button-${index}`}
                aria-controls={open && activeRow === index ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open && activeRow === index ? 'true' : undefined}
                onClick={(event) => handleClick(event, index)}>
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
                >
                <MenuItem onClick={()=>displayAndDownloadBase64Image(order,order.tableNumber+"-image.png")}>Print</MenuItem>
              </Menu>
              </TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    )
}
export default QrcodeView;