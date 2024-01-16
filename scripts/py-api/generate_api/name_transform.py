

def snake_to_pascal_case(snake: str) -> str:
    return "".join([word.capitalize() for word in snake.split("_")])


def snake_to_camel_case(snake: str) -> str:
    pascal_case = snake_to_pascal_case(snake)
    return pascal_case[0].lower() + pascal_case[1:]
