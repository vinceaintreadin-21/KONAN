import secrets
import string

from ..models import Room 

def generate_room_code(length=6):
    """Returns unique code to avoid entering existing rooms"""

    alphabet = string.ascii_uppercase + string.digits 

    while True:
        code = "".join(secrets.choice(alphabet) for _ in range(length))

        if not Room.objects.filter(room_code=code).exists():
            return code