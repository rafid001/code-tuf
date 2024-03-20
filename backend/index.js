const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require("cors");
const axios = require('axios');
require('dotenv').config();


const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

const judge0ApiKey = process.env.JUDGE0_API_KEY;

const getSubmission = async (submissionId) => {
  try {
    const options = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
      params: {
        base64_encoded: 'true',
        fields: '*'
      },
      headers: {
        'X-RapidAPI-Key': judge0ApiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    };
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error getting submission:', error);
    throw new Error('Failed to get submission');
  }
};

const createSubmission = async (sourceCode, languageId, stdin) => {
  try {
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': judge0ApiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        source_code: Buffer.from(sourceCode).toString('base64'), // Encode source code to base64
        language_id: languageId.toString(), // Convert language_id to string
        stdin: Buffer.from(stdin).toString('base64') // Encode stdin to base64
      }
    };

    console.log('Sending submission request with options:', options);

    const response = await axios.request(options);
    console.log('Submission response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating submission:', error.response?.data || error);
    throw new Error('Failed to create submission');
  }
};

app.post('/submit', async (req, res) => {
  const { username, codeLanguage, stdin, sourceCode } = req.body;


  console.log('Received data:', {
    username,
    codeLanguage,
    stdin,
    sourceCode,
  });

  try {
    const submissionResult = await createSubmission(sourceCode, codeLanguage, stdin);
    const submissionId = submissionResult.token;
    
    // Fetch submission details
    const submissionDetails = await getSubmission(submissionId);
    console.log(submissionDetails);

    const stdout = submissionDetails.stdout || '';
    
    const query = 'INSERT INTO snippets (username, code_language, stdin, source_code, stdout) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, codeLanguage, stdin, sourceCode, stdout], (error, results, fields) => {
      if (error) {
        console.error('Error inserting snippet:', error);
        res.status(500).send('Error inserting snippet');
        return;
      }
      res.status(200).send('Snippet submitted successfully');
    });
  } catch (error) {
    console.error('Error submitting snippet:', error);
    res.status(500).send('Error submitting snippet');
  }
});

app.get('/snippets', (req, res) => {
  const query = 'SELECT username, code_language, stdin, LEFT(source_code, 100) AS truncated_code, timestamp, stdout FROM snippets';
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error fetching snippets:', error);
      res.status(500).send('Error fetching snippets');
      return;
    }
    res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
