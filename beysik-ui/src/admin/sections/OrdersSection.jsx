// filepath: beysik-ui/src/admin/sections/OrdersSection.jsx
import React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Chip, Tooltip, IconButton
} from '@mui/material';
import { Visibility as VisibilityIcon, EditNote as EditNoteIcon } from '@mui/icons-material';

const OrdersSection = ({ orders }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>Order Management</Typography>
      <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #EBEBEB' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  #{order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total ? order.total.toFixed(2) : '0.00'}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    color={
                      order.status === 'Delivered' ? 'success' :
                      order.status === 'Shipped' ? 'info' :
                      order.status === 'Processing' ? 'warning' :
                      'default'
                    }
                    sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton size="small" sx={{ mr: 1 }} onClick={() => console.log('View order', order.id)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Update Status">
                    <IconButton size="small" color="primary" onClick={() => console.log('Update status for order', order.id)}>
                      <EditNoteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default OrdersSection;