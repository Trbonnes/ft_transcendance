import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity'

class MockService
{
  // TO DO find a way to create users in bulk with typeorm, maybe we can use the user repositery to do this ?
  // mockData : Partial<User>[] = [
  //   new Partial<User>({id : "1", email: "bob@mydomain.com"}),
  // ]
  findAll() {
    return Promise.resolve([])
  }
}

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
    .overrideProvider(UsersService).useClass(MockService)
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return all the users', async ()=>{
    let data = await controller.findAll()
    expect(data).toEqual([])
  })
});
