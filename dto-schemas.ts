import { MovieScreeningTypeEnum } from 'src/enums/movieScreeningType.enum';

export const DTO_Schemas = {
  UserRegistrationDTO: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
      },
    },
    required: ['fullName', 'email', 'password'],
    additionalProperties: false,
  },
  UserUpdateDTO: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
      },
    },
    required: [],
    additionalProperties: false,
  },
  LoginDTO: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  },
  MovieScreeningCreateDTO: {
    type: 'object',
    properties: {
      dateAndTime: {
        type: 'string',
        format: 'date-time',
      },
      movieId: {
        type: 'integer',
      },
      auditoriumId: {
        type: 'integer',
      },
    },
    required: ['dateAndTime', 'movieId', 'auditoriumId'],
    additionalProperties: false,
  },
  MovieScreeningEditDTO: {
    type: 'object',
    properties: {
      dateAndTime: {
        type: 'string',
        format: 'date-time',
      },
      status: {
        type: 'string',
        enum: Object.values(MovieScreeningTypeEnum),
      },
      movieId: {
        type: 'integer',
      },
      auditoriumId: {
        type: 'integer',
      },
    },
    required: [],
    additionalProperties: false,
  },
};