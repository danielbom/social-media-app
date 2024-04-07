from .json_schema import JsonType, JsonSchema

def generate_schema_typescript(schema: JsonSchema, indent: int = 0):
    if schema.tag == 'any':
        return 'any'
    if schema.tag == 'null':
        return 'null'
    if schema.tag == 'boolean':
        return 'boolean'
    if schema.tag == 'number':
        return 'number'
    if schema.tag == 'string':
        return 'string'
    if schema.tag == 'array':
        return f'Array<{generate_schema_typescript(schema.items, indent+1)}>'
    if schema.tag == 'object':
        if not schema.properties:
            return '{}'
        return ''.join([
            '{\n',
            ',\n'.join(f'{"  "*(indent+1)}{k}: {generate_schema_typescript(v, indent+1)}'
                       for k, v in schema.properties.items()),
            '\n}',
        ])
    if schema.tag == 'ref':
        return schema.ref
    return ''


def generate_type_typescript(jt: JsonType):
    return f'export type {jt.name} = {generate_schema_typescript(jt.schema)}'


def generate_types_typescript(types: list[JsonType]):
    return '\n\n'.join(generate_type_typescript(jt) for jt in types)
