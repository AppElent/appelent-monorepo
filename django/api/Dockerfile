FROM python:3

ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app

RUN pip install --upgrade pip
RUN pip install pipenv
COPY Pipfile Pipfile.lock ./

RUN pipenv install --system --deploy
COPY . .

#RUN exec python manage.py collectstatic --no-input
#CMD exec gunicorn crud_api.wsgi:application --bind 0.0.0.0:8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000