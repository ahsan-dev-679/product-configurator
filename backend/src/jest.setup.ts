// jest.setup.ts

jest.mock('@nestjs/mongoose', () => ({
  Prop: () => () => {},
  Schema: () => () => {},
  SchemaFactory: {
    createForClass: () => ({}),
  },
  InjectModel: () => jest.fn(),
  getModelToken: () => 'ProductModel',
}));

jest.mock('mongoose', () => ({
  Model: jest.fn(),
}));