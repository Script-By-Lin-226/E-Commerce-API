from pydantic import BaseModel, validator, EmailStr, ValidationError
from string import punctuation

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str

    @validator('password')
    def password_validator(cls, value):
        has_digit = False
        has_upper = False
        has_punctuation = False

        if any(x.isdigit() for x in value):
            has_digit = True

        if any(x.isupper() for x in value):
            has_upper = True

        if any(x in punctuation for x in value):
            has_punctuation = True

        if len(value) >= 8 and has_digit and has_upper and has_punctuation:
            return value
        else:
            raise ValidationError('Password must have at least 8 characters | at least 1 uppercase letters | 1 digits | 1 punctuation')

    @validator('role')
    def role_validator(cls, value):
        if value not in ['user', 'admin', 'sale' , 'hr']:
            raise ValidationError('Role must be either user or admin')
        return value

class UserLogin(BaseModel):
    email: EmailStr
    password: str
