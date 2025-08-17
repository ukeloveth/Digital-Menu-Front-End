import './App.css'
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Alert,
  Fade,
  Skeleton
} from '@mui/material';
import { 
  MoreHorizOutlined, 
  QrCode2, 
  TableRestaurant, 
  AccessTime,
  Print,
  Add
} from '@mui/icons-material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {getTimeAgo} from './utils'
import { orderAPI } from './api';
import dayjs from 'dayjs';

const QrcodeView = () => {
    const [qrcodes, setQrcodes] = useState([]);
    const [activeRow, setActiveRow] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableNumber, setTableNumber] = useState('')
    const open = Boolean(anchorEl);

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
        setError('Failed to fetch QR codes');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
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

    const handleGenerateQrcode = async() => {
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
        setError(`Failed to generate QR code`);
      } finally {
        setLoading(false);
      }
    }

    const handleClick = (event, rowIndex) => {
        setAnchorEl(event.currentTarget);
        setActiveRow(rowIndex);
      };
      
    const handleChange = (event) => {
        setTableNumber(event.target.value);
      };
      
    const handleClose = () => {
        setAnchorEl(null);
        setActiveRow(null);
      };

    const renderQRCodeForm = () => (
      
        <Card sx={{ 
      borderRadius: 3,
      border: '1px solid rgba(109, 238, 126, 0.1)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      <CardContent sx={{ p: '1rem' }}>
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
            }}>
                Generate Table QR Code
              </Typography>
            </Box>

            {/* Form */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: { xs: 'stretch', md: 'center' }
            }}>
              <TextField 
                fullWidth
                label="Table Number" 
                variant="outlined" 
                onChange={handleChange} 
                value={tableNumber}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'rgba(109, 238, 126, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6dee7e',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#6dee7e',
                  },
                }}
                placeholder="Enter table number (e.g., 1, 2, 3...)"
              />
              
              <Button 
                onClick={handleGenerateQrcode}
                variant="contained"
                disabled={loading || !tableNumber.trim()}
                sx={{
                  backgroundColor: '#6dee7e',
                  color: 'white',
                  fontWeight: 700,
                  fontFamily: 'Raleway',
                  fontSize: '1rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none',
                  minWidth: { xs: '100%', md: 'auto' },
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
                startIcon={loading ? <Skeleton variant="circular" width={20} height={20} /> : <Add />}
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </Box>

            {/* Help Text */}
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: '#7f8c8d',
                fontFamily: 'Raleway',
                fontStyle: 'italic'
              }}
            >
              Enter a table number to generate a unique QR code that customers can scan to view the menu.
            </Typography>
          </CardContent>
        </Card>
      
    );

    const renderQRCodeTable = () => (
      <Card sx={{ 
        borderRadius: 3,
        border: '1px solid rgba(109, 238, 126, 0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        width: '100% !important'
      }}>
        <CardContent sx={{ p: 0, width: '100% !important'}}>
          {/* Table Header */}
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
              Generated QR Codes
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#7f8c8d',
                fontFamily: 'Raleway',
                mt: 1
              }}
            >
              {qrcodes.length} QR code{qrcodes.length !== 1 ? 's' : ''} generated
            </Typography>
          </Box>
          
          {/* Table */}
          <TableContainer>
            <Table sx={{ minWidth: '100%' }} aria-label="QR codes table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(109, 238, 126, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Table</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>QR Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Created</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'Raleway' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qrcodes && qrcodes.map((qrcode, index) => (
                  <TableRow
                    key={`${qrcode.tableNumber}-${index}`}
                    sx={{ 
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
                           {qrcode.tableNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QrCode2 sx={{ color: '#6dee7e', fontSize: 20 }} />
                        <Chip 
                          label={`${qrcode.qrCodeBase64.substring(0, 12)}...`}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(109, 238, 126, 0.1)',
                            color: '#6dee7e',
                            fontWeight: 600,
                            fontFamily: 'monospace',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ color: '#6dee7e', fontSize: 16 }} />
                        <Typography sx={{ fontFamily: 'Raleway' }}>
                          {getTimeAgo(qrcode.createdAt)}
                        </Typography>
                      </Box>
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
                      >
                        <MenuItem onClick={() => displayAndDownloadBase64Image(qrcode, `table-${qrcode.tableNumber}-qr.png`)}>
                          <Print sx={{ mr: 1, color: '#6dee7e' }} />
                          Print & Download
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
        <div className='admin-container' style={{justifyContent:'flex-start', alignItems:'flex-start'}}>
          {/* Error Display */}
          {error && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ mb: 3, width: '100%' }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {/* QR Code Generation Form */}
          {renderQRCodeForm()}

          {/* QR Codes Table */}
          {renderQRCodeTable()}
        </div>
    )
}
export default QrcodeView;