import pytest

# Comment this line to run the example tests
pytest.skip(allow_module_level=True)


# Fixture can be used as argument of any test
# Fixture are unique for each test
@pytest.fixture
def data_sample():
    return {'a': 1, 'b': 2, 'c': 3}


# All tests must assert something
def test_hello():
    assert True == True


# Each parameter will be tested
@pytest.mark.parametrize(
    'lhs,rhs,expected',
    [
        (1, 1, 2),
        (3, 5, 8),
    ],
)
def test_add(lhs, rhs, expected):
    assert lhs + rhs == expected


# Using fixture
def test_data_sample(data_sample):
    assert data_sample.get('a') == 1
    assert data_sample.get('b') == 2
    assert data_sample.get('c') == 3
    data_sample['a'] = 2


# Fixture can not be changed for other tests
def test_data_sample_again(data_sample):
    assert data_sample.get('a') == 1


def test_error():
    with pytest.raises(Exception):
        raise Exception('Test error')
