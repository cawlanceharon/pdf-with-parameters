const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/generate-pdf', async (req, res) => {
  const { first_name } = req.query;  // Get the first_name parameter from the query string
  
  if (!first_name) {
    return res.status(400).send('first_name parameter is required');
  }

  // Read the HTML template
  const htmlTemplatePath = path.resolve(__dirname, 'template.html');
  const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

  // Replace the placeholder with the actual value
  const htmlWithValues = htmlTemplate.replace(/{first_name}/g, first_name);

  // Launch puppeteer to convert HTML to PDF
  const browser = await puppeteer.launch({ headless: false }); // Set headless to false for debugging
  const page = await browser.newPage();
  await page.setContent(htmlWithValues);

  // Convert HTML to PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',           // Paper size
    path: 'output.pdf'      // Optional: saves PDF to a file for debugging
  });

  // Close browser
  await browser.close();

  // Send PDF as a response
  res.contentType('application/pdf');
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
