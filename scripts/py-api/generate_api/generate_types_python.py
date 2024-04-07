from .json_schema import JsonType, JsonSchema

imports = '''
from typing import Any, List
'''.lstrip()

def generate_schema_python(schema: JsonSchema, indent: int = 0):
    if schema.tag == 'any':
        return 'Any'
    if schema.tag == 'null':
        return 'None'
    if schema.tag == 'boolean':
        return 'bool'
    if schema.tag == 'number':
        return 'float'
    if schema.tag == 'string':
        return 'str'
    if schema.tag == 'array':
        return f'List[{generate_schema_python(schema.items, indent+1)}]'
    if schema.tag == 'object':
        return 'Any' # TODO: Implement object generation
    if schema.tag == 'ref':
        return schema.ref
    return ''

def generate_type_python(jt: JsonType):
    if jt.schema.tag == 'object':
        return f"class {jt.name}:\n" + ''.join([
            f"    {k}: {generate_schema_python(v)}\n"
            for k, v in jt.schema.properties.items()
        ])
    return f"{jt.name} = {generate_schema_python(jt.schema)}"


def generate_types_python(types: list[JsonType]):
    
    return imports + '\n\n' + '\n\n'.join(generate_type_python(jt) for jt in types)
