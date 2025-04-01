// Netlify serverless function to proxy Meetup API requests
// This avoids CORS issues when calling the Meetup API directly from the browser

const axios = require('axios');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }
  
  // Get group name from query parameter or use default
  const groupUrlName = event.queryStringParameters?.group || 'roanoke-valley-net-user-group';
  
  try {
    // Fetch events from Meetup API
    const response = await axios.get(
      `https://api.meetup.com/${groupUrlName}/events`,
      {
        params: {
          page: 20,
          status: 'upcoming,past',
          desc: true,
          sign: true,
          'photo-host': 'public'
        }
      }
    );
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log('Error fetching Meetup events:', error);
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data || 'Unknown error'
      })
    };
  }
}; 