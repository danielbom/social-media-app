from datetime import datetime
from typing import Optional


def format_date(date: Optional[datetime]) -> Optional[str]:
    return date.strftime('%Y-%m-%d %H:%M:%S') if date else None
