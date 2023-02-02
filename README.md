# server-template
This is a template for making a server with React and Flask.
<br><br>

## Setup
### Frontend
```bash
npm install
```

<br>

### Backend
```bash
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

<br><br>

## Deployment
### Frontend
```bash
npm start build
serve -s build
```

<br>

### Backend
```bash
source venv/bin/activate
gunicorn --workers=1 --bind 0.0.0.0:5001 server:app
```