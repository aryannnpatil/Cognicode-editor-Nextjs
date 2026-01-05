# Django Starter Template

A minimal Django project setup with Django REST Framework and CORS support.

## Getting Started

### Prerequisites

- Python 3.10+
- pip

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy environment variables:
```bash
cp .env.example .env
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start the development server:
```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`

## Project Structure

```
django/
├── core/                   # Main project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── api/                    # API application
│   ├── __init__.py
│   ├── views.py
│   ├── urls.py
│   └── serializers.py
├── manage.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

- `GET /api/` - API root
- `GET /api/health/` - Health check endpoint

## Features

- Django 4.2+
- Django REST Framework
- CORS headers configured
- Environment variables with python-dotenv
- SQLite database (default)
- Ready for production with Gunicorn

## Deployment

For production deployment:

```bash
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

## License

MIT
