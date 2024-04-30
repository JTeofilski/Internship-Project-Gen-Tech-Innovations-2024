import { maxLength, minLength } from 'class-validator';
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
  GenreCreateDTO: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
    required: ['name'],
    additionalProperties: false,
  },
  MovieCreateDTO: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      duration: {
        type: 'integer',
      },
      genreIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
        minItems: 1,
      },
      price: {
        type: 'integer',
      },
    },
    required: ['name', 'duration', 'genreIds'],
    additionalProperties: false,
  },
  TicketsBuyingOrReservationDTO: {
    type: 'object',
    properties: {
      movieScreeningId: {
        type: 'integer',
      },
      seatIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
        minItems: 1,
      },
    },
    required: ['movieScreeningId', 'seatIds'],
    additionalProperties: false,
  },
  ForgottenPasswordDTO: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['email'],
    additionalProperties: false,
  },
  ResetPasswordDTO: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        minLength: 1,
      },
      newPassword: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['email', 'newPassword'],
    additionalProperties: false,
  },
  ChangePasswordDTO: {
    type: 'object',
    properties: {
      newPassword: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['newPassword'],
    additionalProperties: false,
  },
  FirtsLetterFilterDTO: {
    type: 'object',
    properties: {
      letter: {
        type: 'string',
        minLength: 1,
        maxLength: 1,
        pattern: '^[a-zA-Z]$',
      },
    },
    required: ['letter'],
    additionalProperties: false,
  },
  SubstringFilterDTO: {
    type: 'object',
    properties: {
      word: {
        type: 'string',
        minLength: 1,
        pattern: '^[a-zA-Z]$',
      },
    },
    required: ['word'],
    additionalProperties: false,
  },
};
