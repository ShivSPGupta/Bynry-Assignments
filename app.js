const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

let serviceRequests = [];


app.post('/service-requests', (req, res) => {
    const { type, details } = req.body;
    const submissionDate = new Date();
    const request = { 
        id: serviceRequests.length + 1,
        type,
        details,
        status: 'submitted',
        submissionDate
    };
    serviceRequests.push(request);

    
    res.status(201).json({ id: request.id, submissionDate: submissionDate.toLocaleString('en-IN') });

   
    setTimeout(() => {
        resolveRequest(request.id);
    }, 48 * 60 * 60 * 1000);
});


app.get('/service-requests/:id', (req, res) => {
    const requestId = parseInt(req.params.id);
    const request = serviceRequests.find(req => req.id === requestId);
    if (!request) {
        return res.status(404).json({ error: 'Request not found' });
    }
    const response = {
        id: request.id,
        type: request.type,
        details: request.details,
        status: request.status,
        submissionDate: request.submissionDate.toLocaleString('en-IN'),
        resolutionDate: request.resolutionDate ? request.resolutionDate.toLocaleString('en-IN') : null
    };
    res.json(response);
});


function resolveRequest(requestId) {
    const request = serviceRequests.find(req => req.id === requestId);
    if (request && request.status === 'submitted') {
        request.status = 'resolved';
        request.resolutionDate = new Date();
        console.log(`Request ${requestId} resolved automatically after 48 hours`);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
