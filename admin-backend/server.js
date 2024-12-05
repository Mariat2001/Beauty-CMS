const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods:  ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type']
}));

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'beauty_ecomm'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())";
        const values = [name, email, hashedPassword];

        db.query(sql, values, (err, data) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ message: 'Error creating user' });
                return;
            }
            res.status(201).json(data);
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error retrieving user' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];
        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ message: 'Error during login' });
        }
    });
});

app.post('/addbrands', async (req, res) => {
    const { name, category, description ,imageUrl } = req.body;
  
    try {
      const sql = "INSERT INTO brands (name, category, description, image, created_at) VALUES (?, ?, ?, ? , NOW())";
      const values = [name, category, description,imageUrl];
  
      db.query(sql, values, (err, data) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ message: 'Error executing database query' });
        }
        res.status(201).json({ message: 'Brand added successfully' });
      });
    } catch (err) {
      console.error('Error handling request:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
app.post('/getbrands', async (req, res) => {
  try {
    const sql = "SELECT * FROM brands";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving brands' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getbrands endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/getbrandsname', async (req, res) => {
  try {
    // Query to get distinct brands
    const sql = "SELECT DISTINCT name FROM brands";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving brands' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getbrands endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deletebrand/:id', async (req, res) => {
  try {
    const brandId = req.params.id;
    console.log(`Received request to delete brand with id: ${brandId}`);
    const sql = "DELETE FROM brands WHERE id = ?";
    db.query(sql, [brandId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting brand' });
      }
      res.status(200).json({ message: 'Brand deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deletebrand endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.put('/updatebrand/:id', async (req, res) => {
  try {
    const brandId = req.params.id;
    const { name, description, category, imageUrl } = req.body;

    console.log(`Received request to update brand with id: ${brandId}`);

    // Ensure the necessary fields are provided
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE brands 
      SET name = ?, description = ?, category = ?, image = ? ,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [name, description, category, imageUrl, brandId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating brand' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Brand not found' });
      }

      res.status(200).json({ message: 'Brand updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updatebrand endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/addmakeups', async (req, res) => {
  const { name, brand,category, description,type ,price ,imageUrl } = req.body;

  try {
    const sql = "INSERT INTO makeup (name,brand, category, description, type,price ,image, created_at) VALUES (?, ?, ?, ? , ? , ? ,? , NOW())";
    const values = [name,brand, category, description,type ,price ,imageUrl];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'Makeup added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/getmakeups', async (req, res) => {
  try {
    const sql = "SELECT * FROM makeup";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving makeup' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getmakeups endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deletemakeups/:id', async (req, res) => {
  try {
    const makeupId = req.params.id;
    console.log(`Received request to delete makeup with id: ${makeupId}`);
    const sql = "DELETE FROM makeup WHERE id = ?";
    db.query(sql, [makeupId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting makeup' });
      }
      res.status(200).json({ message: 'Makeup deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deletemakeups endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.put('/updatemakeup/:id', async (req, res) => {
  try {
    const makeupId = req.params.id;
    const {name, brand,category, description,type ,price, imageUrl } = req.body;

    console.log(`Received request to update brand with id: ${makeupId}`);

    // Ensure the necessary fields are provided
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE makeup 
      SET name = ?,brand = ?, description = ?, category = ?, type =?, price = ?, image = ? ,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [name, brand,category, description,type ,price, imageUrl, makeupId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating makeup' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Makeup not found' });
      }

      res.status(200).json({ message: 'Makeup updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updatemakeup endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/addskincare', async (req, res) => {
  const { name, brand,category, description,type ,price ,imageUrl } = req.body;

  try {
    const sql = "INSERT INTO skin_care (name,brand, category, description, type,price ,image, created_at) VALUES (?, ?, ?, ? , ? , ? ,? , NOW())";
    const values = [name,brand, category, description,type ,price ,imageUrl];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'Skincare added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/getskincare', async (req, res) => {
  try {
    const sql = "SELECT * FROM skin_care";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving skincare' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getskincare endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deleteskincare/:id', async (req, res) => {
  try {
    const skincareId = req.params.id;
    console.log(`Received request to delete makeup with id: ${skincareId}`);
    const sql = "DELETE FROM skin_care WHERE id = ?";
    db.query(sql, [skincareId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting makeup' });
      }
      res.status(200).json({ message: 'Skincare deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deleteskincare endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/updateskincare/:id', async (req, res) => {
  try {
    const skincareId = req.params.id;
    const {name, brand,category, description,type ,price, imageUrl } = req.body;

    console.log(`Received request to update brand with id: ${skincareId}`);

    // Ensure the necessary fields are provided
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE skin_care 
      SET name = ?,brand = ?, description = ?, category = ?, type =?, price = ?, image = ? ,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [name, brand,category, description,type ,price, imageUrl, skincareId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating skincare' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Skincare not found' });
      }

      res.status(200).json({ message: 'Skincare updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updateskincare endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/addhaircare', async (req, res) => {
  const { name, brand,category, description,type ,price ,imageUrl } = req.body;

  try {
    const sql = "INSERT INTO hair_care (name,brand, category, description, type,price ,image, created_at) VALUES (?, ?, ?, ? , ? , ? ,? , NOW())";
    const values = [name,brand, category, description,type ,price ,imageUrl];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'HairCare added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/gethaircare', async (req, res) => {
  try {
    const sql = "SELECT * FROM hair_care";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving haircare' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /gethaircare endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deletehaircare/:id', async (req, res) => {
  try {
    const haircareId = req.params.id;
    console.log(`Received request to delete makeup with id: ${haircareId}`);
    const sql = "DELETE FROM hair_care WHERE id = ?";
    db.query(sql, [haircareId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting makeup' });
      }
      res.status(200).json({ message: 'Haircare deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deletehaircare endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.put('/updateshaircare/:id', async (req, res) => {
  try {
    const haircareId = req.params.id;
    const {name, brand,category, description,type ,price, imageUrl } = req.body;

    console.log(`Received request to update brand with id: ${haircareId}`);

    // Ensure the necessary fields are provided
    if (!name || !description || !category || !brand || !type ||! price ) {
      return res.status(400).json({ message: 'Name, description, and category , brand ,type , price are required' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE hair_care 
      SET name = ?,brand = ?, description = ?, category = ?, type =?, price = ?, image = ? ,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [name, brand,category, description,type ,price, imageUrl, haircareId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating haircare' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Haircare not found' });
      }

      res.status(200).json({ message: 'Haircare updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updatehaircare endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/addFragrances', async (req, res) => {
  const { name, brand, category, description, type, price, imageUrl } = req.body;

  try {
    const sql = "INSERT INTO fragrances (name, brands, category, description, type, price, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    const values = [name, brand, category, description, type, price, imageUrl];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'Fragrance added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/getFrangrance', async (req, res) => {
  try {
    const sql = "SELECT * FROM fragrances";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving frangrance' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /fragrances endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deletefragrance/:id', async (req, res) => {
  try {
    const fragranceId = req.params.id;
    console.log(`Received request to delete frangrance with id: ${fragranceId}`);
    const sql = "DELETE FROM fragrances WHERE id = ?";
    db.query(sql, [fragranceId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting frangrance' });
      }
      res.status(200).json({ message: 'frangrance deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deletefrangrance endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/updatefrangrance/:id', async (req, res) => {
  try {
    const fragranceId = req.params.id;
    const {name, brand, category, description, type, price, imageUrl} = req.body;

    console.log(`Received request to update fragrance with id: ${fragranceId}`);

    // Ensure the necessary fields are provided
    if (!name || !description || !category || !brand || !type || !price) {
      return res.status(400).json({ message: 'Name, description, category, brand, type, and price are required' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE fragrances 
      SET name = ?, brands = ?, category = ?, description = ?, type = ?, price = ?, image = ?, updated_at = NOW()
      WHERE id = ?
    `;



    // Execute the query
    db.query(sql, [name, brand, category, description, type, price, imageUrl, fragranceId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating Fragrance' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Fragrance not found' });
      }

      res.status(200).json({ message: 'Fragrance updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updatefrangrance endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/addtool_brush', async (req, res) => {
  const { name, brand,category, description,type ,price ,imageUrl } = req.body;

  try {
    const sql = "INSERT INTO tool_brush (name,brand, category, description, type,price ,image, created_at) VALUES (?, ?, ?, ? , ? , ? ,? , NOW())";
    const values = [name,brand, category, description,type ,price ,imageUrl];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'tool_brush added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/gettool_brush', async (req, res) => {
  try {
    const sql = "SELECT * FROM tool_brush";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving tool_brush' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /gettool_brush endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deletetool_brush/:id', async (req, res) => {
  try {
    const tool_brushId = req.params.id;
    console.log(`Received request to delete makeup with id: ${tool_brushId}`);
    const sql = "DELETE FROM tool_brush WHERE id = ?";
    db.query(sql, [tool_brushId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting tool_brush' });
      }
      res.status(200).json({ message: 'tool_brush deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deletetool_brush endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.put('/updatestool_brush/:id', async (req, res) => {
  try {
    const tool_brushId = req.params.id;
    const {name, brand,category, description, type ,price, imageUrl } = req.body;

    console.log(`Received request to update brand with id: ${tool_brushId}`);

    // Ensure the necessary fields are provided
    if (!name || !description || !category || !brand || !type ||! price ) {
      return res.status(400).json({ message: 'Name, description, and category , brand ,type , price are required' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE tool_brush 
      SET name = ?,brand = ?,  category = ?, description = ? , type =?, price = ?, image = ? ,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [name, brand,category, description, type ,price, imageUrl, tool_brushId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating tool_brush' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'tool_brush not found' });
      }

      res.status(200).json({ message: 'tool_brush updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updatestool_brush endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.delete('/deleteContact_Us', async (req, res) => {
  try {
    const sql = "DELETE FROM contact_us"; // This deletes all records in the table
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting contact_us entries' });
      }
      res.status(200).json({ message: 'All contact_us entries deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deleteContact_Us endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/addContactUs', async (req, res) => {
  console.log(req)
  const { telephone, instagram, email, facebook, linkedin, youtube, address } = req.body;

  try {
    const sql = "INSERT INTO contact_us (telephone, instagram, email, facebook, linkedin, youtube, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    const values = [telephone, instagram, email, facebook, linkedin, youtube, address];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'Contact added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/updatesContactUs/:id', async (req, res) => {
  try {
    const ContactUsId = req.params.id;
    const {telephone, instagram,email, facebook, linkedin ,youtube, address } = req.body;

    console.log(`Received request to update brand with id: ${ContactUsId}`);

    // Ensure the necessary fields are provided
    if (!telephone || !instagram || !email || !facebook || !linkedin ||! youtube ||!address ) {
      return res.status(400).json({ message: 'Name, description, and category , brand ,type , price are required' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE contact_us 
      SET telephone = ?,instagram = ?,  email = ?, facebook = ? , linkedin =?, youtube = ?, address = ? ,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [telephone, instagram,email, facebook, linkedin ,youtube, address, ContactUsId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating contact_us' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'contact_us not found' });
      }

      res.status(200).json({ message: 'contact_us updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updatesContactUs endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/getContactUs', async (req, res) => {
  try {
    const sql = "SELECT * FROM contact_us";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving contact_us' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getcontact_us endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/getCount', async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS total_count FROM contact_us";
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving contact_us' });
      }
      
      // Assuming `results` is an array with a single row
      const count = results[0]['total_count'];
      console.log(count)
      res.status(200).json({ total_count: count });
    });
  } catch (error) {
    console.error('Error in /getCount endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/addDescription', async (req, res) => {
  console.log(req)
 
  const { description } = req.body;
  console.log(description)
  try {
    const sql = "INSERT INTO description (description, created_at) VALUES (?, NOW())";
    const values = [description];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'Description added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/getDescription', async (req, res) => {
  try {
    const sql = "SELECT * FROM description";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving description' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getdescription endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
app.delete('/deleteDescription', async (req, res) => {
  try {
    const sql = "DELETE FROM description"; // This deletes all records in the table
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting description entries' });
      }
      res.status(200).json({ message: 'All description entries deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deleteDescription endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/updatesDescription/:id', async (req, res) => {
  try {
    const DescriptionId = req.params.id;
    const {description} = req.body;

    console.log(`Received request to update brand with id: ${DescriptionId}`);

    // Ensure the necessary fields are provided
    if (!description ) {
      return res.status(400).json({ message: 'description' });
    }

    // Prepare the SQL query with placeholders
    const sql = `
      UPDATE description 
      SET description = ?,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [description,DescriptionId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating description' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'description not found' });
      }

      res.status(200).json({ message: 'description updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updatesDescription endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/getCountDescription', async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) AS total_count FROM description";
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving description' });
      }
      
      // Assuming `results` is an array with a single row
      const count = results[0]['total_count'];
      console.log(count)
      res.status(200).json({ total_count: count });
    });
  } catch (error) {
    console.error('Error in /getCountDescription endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.post('/getLocation', async (req, res) => {
  try {
    const sql = "SELECT * FROM map";
    db.query(sql, (err, result) => {
      console.log(result);
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving map' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getMap endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/addUpdateLocation', async (req, res) => {
  const { Name, latitude, longitude } = req.body;

  try {
    // Check if there are any existing rows in the table
    const checkSql = `SELECT COUNT(*) AS count FROM map`;
    
    db.query(checkSql, (err, result) => {
      if (err) {
        console.error('Error checking existing rows:', err);
        return res.status(500).json({ message: 'Error checking existing rows' });
      }

      // If no rows exist, insert the new record
      if (result[0].count === 0) {
        const insertSql = `
          INSERT INTO map (Name, latitude, longitude, created_at)
          VALUES (?, ?, ?, NOW())
        `;
        const values = [Name, latitude, longitude];

        db.query(insertSql, values, (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting new record:', insertErr);
            return res.status(500).json({ message: 'Error inserting new record' });
          }
          res.status(201).json({ message: 'Map location added successfully' });
        });
      } else {
        // If rows exist, update the first row
        const updateSql = `
          UPDATE map 
          SET Name = ?, latitude = ?, longitude = ?, updated_at = NOW() 
          LIMIT 1
        `;
        const updateValues = [Name, latitude, longitude];

        db.query(updateSql, updateValues, (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating existing record:', updateErr);
            return res.status(500).json({ message: 'Error updating existing record' });
          }
          res.status(200).json({ message: 'Map location updated successfully' });
        });
      }
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




app.post('/addslideshow', async (req, res) => {
  const { imgnb, imageUrl } = req.body;  // Use 'imgnb' as it is sent from the frontend
  console.log(req.body);  // Log the entire body to check the structure

  try {
    const sql = "INSERT INTO slideshow (imgnb, image, created_at) VALUES (?, ?, NOW())";
    const values = [imgnb, imageUrl];  // Pass 'imgnb' in the query

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'slideshow added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/getslideshow', async (req, res) => {
  try {
    const sql = "SELECT * FROM slideshow";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving slideshow' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getslideshow endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deleteslideshow/:id', async (req, res) => {
  try {
    const slideshowId = req.params.id;
    console.log(`Received request to delete slideshow with id: ${slideshowId}`);
    const sql = "DELETE FROM slideshow WHERE id = ?";
    db.query(sql, [slideshowId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting slideshow' });
      }
      res.status(200).json({ message: 'slideshow deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deleteslideshow endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/updateslideshow/:id', async (req, res) => {
  try {
    const slideshowId = req.params.id;
    const { imgnb ,imageUrl } = req.body;
    console.log( req.body)
    console.log(`Received request to update brand with id: ${slideshowId}`);

   
    if (!imgnb || !imageUrl) {
      return res.status(400).json({ message: 'imgnb, image are required' });
    }

    const sql = `
      UPDATE slideshow 
      SET imgnb = ?,image = ? ,updated_at = NOW()
      WHERE id = ?
    `;

    // Execute the query
    db.query(sql, [imgnb,  imageUrl, slideshowId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error updating slideshow' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'slideshow not found' });
      }

      res.status(200).json({ message: 'slideshow updated successfully' });
    });
  } catch (error) {
    console.error('Error in /updateslideshow endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/addtodo', async (req, res) => {
  const { description } = req.body;  // Use 'imgnb' as it is sent from the frontend
  console.log(req.body);  // Log the entire body to check the structure

  try {
    const sql = "INSERT INTO todo (description,created_at) VALUES (?, NOW())";
    const values = [description];  // Pass 'imgnb' in the query

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error executing database query' });
      }
      res.status(201).json({ message: 'Todo added successfully' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/getTodo', async (req, res) => {
  try {
    const sql = "SELECT * FROM todo";
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error retrieving todo' });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in /getTodo endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/deleteTodo/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    console.log(`Received request to delete todo with id: ${todoId}`);
    const sql = "DELETE FROM todo WHERE id = ?";
    db.query(sql, [todoId], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Error deleting todo' });
      }
      res.status(200).json({ message: 'todo deleted successfully' });
    });
  } catch (error) {
    console.error('Error in /deleteTodo endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
