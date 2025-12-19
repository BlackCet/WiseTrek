import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper, CircularProgress, Box } from '@mui/material';
import { Menu } from '@headlessui/react';
import apiService from '../services/apiService';

function HomePage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.get('/test')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setMessage("Could not connect to the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
       WISETREK
      </Typography>

      
<h1 className="text-3xl font-bold text-purple-600">
  Tailwind v4 is working 🚀
</h1>


      <Typography variant="body1" paragraph>
        This is the starting point for your application. Use the components below to build out your features.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'center' }}>
        {/* Example of a Material-UI button */}
        <Button variant="contained">Plan a New Trip</Button>

        {/* Example of a Headless UI Menu component */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
           <Menu>
             <Menu.Button as={Button} variant="outlined">
               Options
             </Menu.Button>
             {/* Style this Menu.Items with CSS or a library like Tailwind */}
             <Menu.Items style={{ position: 'absolute', background: 'white', border: '1px solid #ccc', borderRadius: '4px', marginTop: '8px', padding: '8px', zIndex: 10 }}>
               <Menu.Item><a href="/account-settings"><Typography sx={{ p: 1 }}>Account settings</Typography></a></Menu.Item>
               <Menu.Item><a href="/documentation"><Typography sx={{ p: 1 }}>Documentation</Typography></a></Menu.Item>
             </Menu.Items>
           </Menu>
         </div>
      </Box>
    </Paper>
  );
}

export default HomePage;