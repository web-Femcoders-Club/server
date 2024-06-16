/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { FaqController } from './../src/faq/faq.controller';
import { FaqService } from './../src/faq/faq.service';
import { CreateFaqDto } from './../src/faq/dto/create-faq.dto';
import { UpdateFaqDto } from './../src/faq/dto/update-faq.dto';

describe('FaqController', () => {
  let controller: FaqController;
  let service: FaqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaqController],
      providers: [
        {
          provide: FaqService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FaqController>(FaqController);
    service = module.get<FaqService>(FaqService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a FAQ', async () => {
    const createFaqDto: CreateFaqDto = { faqQuestion: 'Where do we originate from?', faqAnswer: 'We come from Barcelona...' };
    const result = { idFaq: 1, ...createFaqDto };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createFaqDto)).toBe(result);
  });

  it('should update a FAQ', async () => {
    const updateFaqDto: UpdateFaqDto = { faqQuestion: 'Updated Question', faqAnswer: 'Updated Answer' };
    const result = 'La pregunta frecuente fue actualizada';
    jest.spyOn(service, 'update').mockResolvedValue(result);

    expect(await controller.update(1, updateFaqDto)).toBe(result);
  });

  it('should delete a FAQ', async () => {
    const result = 'Pregunta frecuente eliminada exitosamente';
    jest.spyOn(service, 'remove').mockResolvedValue(result);

    expect(await controller.remove(1)).toBe(result);
  });
});