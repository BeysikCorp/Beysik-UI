
import React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Chip, Tooltip, IconButton
} from '@mui/material';
import { PersonOutline as PersonOutlineIcon, Edit as EditIcon, Block as BlockIcon } from '@mui/icons-material';

const UsersSection = ({ users }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>User Management</Typography>
      <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #EBEBEB' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  {user.id}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    size="small"
                    color={user.role === 'admin' ? 'secondary' : 'default'}
                    sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit User">
                    <IconButton size="small" color="primary" sx={{ mr: 1 }} onClick={() => console.log('Edit user', user.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Suspend User">
                    <IconButton size="small" color="error" onClick={() => console.log('Suspend user', user.id)}>
                      <BlockIcon fontSize="small" />
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

export default UsersSection;