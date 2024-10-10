const nameFunction = (req, res) => {
  try {
    // Your normal logic here
    res.json('Miriam Suchanski');
  } catch (error) {
    // Handle any errors and return a 500 status
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { nameFunction };
