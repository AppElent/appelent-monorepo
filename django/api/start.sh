#!/bin/sh
python manage.py migrate
exec gunicorn api.wsgi:application --bind 0.0.0.0:8000  --log-level info --access-logfile '-' --error-logfile '-'