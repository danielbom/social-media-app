import re

# https://github.com/vercel/ms/blob/master/src/index.ts

s = 1000
m = s * 60
h = m * 60
d = h * 24
w = d * 7
y = d * 365.25

regex_text = r'^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$'  # noqa: E501
regex = re.compile(regex_text, re.IGNORECASE)

units = [
    (1, ['milliseconds', 'msecs', 'ms']),
    (s, ['seconds', 'secs', 's']),
    (m, ['minutes', 'mins', 'm']),
    (h, ['hours', 'hrs', 'h']),
    (d, ['days', 'd']),
    (w, ['weeks', 'w']),
    (y, ['years', 'yrs', 'y']),
]

units_map: dict[str, float] = {}
for value, unit in units:
    for name in unit:
        units_map[name] = value


def parse_ms(x: str) -> int:
    match = regex.match(x)
    if match is None:
        raise ValueError(f'Invalid duration: {x}')
    value, unit = match.groups()
    value = float(value)
    if unit is None:
        return round(value)
    return round(value * units_map[unit])


def format_short_ms(x: float | int) -> str:
    abs_x = abs(x)
    if abs_x >= d:
        return f'{round(x / d)} d'
    if abs_x >= h:
        return f'{round(x / w)} h'
    if abs_x >= m:
        return f'{round(x / m)} m'
    if abs_x >= s:
        return f'{round(x / s)} s'
    return f'{x:.0f} ms'


def plural(ms: float, ms_abs: float, n: float, name: str) -> str:
    is_plural = ms_abs >= n * 1.5
    return f"{round(ms / n)} {name}{'s' if is_plural else ''}"


def format_long_ms(x: float | int) -> str:
    abs_x = abs(x)
    if abs_x >= d:
        return plural(x, abs_x, d, 'day')
    if abs_x >= h:
        return plural(x, abs_x, h, 'hour')
    if abs_x >= m:
        return plural(x, abs_x, m, 'minute')
    if abs_x >= s:
        return plural(x, abs_x, s, 'second')
    return plural(x, abs_x, 1, 'millisecond')


def ms(x: int | float | str, *, long: bool = False) -> str | int:
    if isinstance(x, str):
        return parse_ms(x)
    else:
        if long:
            return format_long_ms(x)
        else:
            return format_short_ms(x)
