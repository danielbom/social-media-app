

def snake_to_pascal_case(snake: str) -> str:
    return "".join([word.capitalize() for word in snake.split("_")])


def snake_to_camel_case(snake: str) -> str:
    pascal_case = snake_to_pascal_case(snake)
    return pascal_case[0].lower() + pascal_case[1:]


def pascal_to_snake_case(pascal: str) -> str:
    upper_indexes = collect_upper_indexes(pascal)
    slices = indexes_to_slices(pascal, upper_indexes)
    return "_".join([pascal[s].lower() for s in slices])


def camel_to_snake_case(camel: str) -> str:
    return pascal_to_snake_case(camel)


def to_snake_case(text: str) -> str:
    if "_" in text:
        return text.lower()
    if text[0].isupper():
        return pascal_to_snake_case(text)
    return camel_to_snake_case(text)


def collect_upper_indexes(text: str) -> list[int]:
    upper_indexes = []
    for i, char in enumerate(text):
        if char.isupper():
            upper_indexes.append(i)
    return upper_indexes


def indexes_to_slices(text: str, indexes: list[int]) -> list[slice]:
    indexes = [0] + indexes + [len(text)]
    slices = [slice(start, stop) for start, stop in zip(indexes, indexes[1:])]
    return [s for s in slices if s.start != s.stop]
