#!/bin/sh
python manage.py migrate --noinput
python manage.py shell -c "
from api.models import Scenario
if not Scenario.objects.exists():
    from django.core.management import call_command
    call_command('loaddata', '/app/fake-data/scenarios.json')
    print('Seeded scenarios.')
else:
    print('Scenarios already exist, skipping seed.')
"
exec daphne -b 0.0.0.0 -p 8000 core.asgi:application