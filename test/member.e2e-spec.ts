/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './../src/member/member.controller';
import { MemberService } from './../src/member/member.service';
import { CreateMemberDto } from './../src/member/dto/create-member.dto';
import { UpdateMemberDto } from './../src/member/dto/update-member.dto';

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a member', async () => {
    const createMemberDto: CreateMemberDto = {
      memberName: 'John',
      memberLastName: 'Doe',
      memberDescription: 'John is a developer.',
      memberRole: 'Developer',
      memberImage: 'https://example.com/image.jpg',
      memberLinkedin: 'https://www.linkedin.com'
    };
    const result = {
      idMember: 1,
      ...createMemberDto
    };
    jest.spyOn(service, 'create').mockImplementation(async () => result);

    expect(await controller.create(createMemberDto)).toBe(result);
  });

  it('should update a member', async () => {
    const updateMemberDto: UpdateMemberDto = {
      memberName: 'Jane',
      memberLastName: 'Doe',
      memberDescription: 'Jane is a developer.',
      memberRole: 'Developer',
      memberImage: 'https://example.com/image.jpg',
      memberLinkedin: 'https://www.linkedin.com'
    };
    const result = {
      idMember: 1,
      ...updateMemberDto
    };
    jest.spyOn(service, 'update').mockImplementation(async () => result);

    expect(await controller.update(1, updateMemberDto)).toBe(result);
  });

  it('should delete a member', async () => {
    const result = { message: 'La integrante 1 fue eliminada' };
    jest.spyOn(service, 'remove').mockImplementation(async () => result);

    expect(await controller.remove(1)).toBe(result);
  });
});


