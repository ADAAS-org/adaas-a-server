// import { config } from 'dotenv';
// config();
// jest.retryTimes(0);
// import { A_EXPRESS_EntityController } from '@adaas/a-sdk/global/A_EXPRESS_EntityController.class';
// import { A_EXPRESS_TYPES__EntityControllerConfig } from '@adaas/a-sdk/types/A_EXPRESS_EntityController.types';
// import { A_EXPRESS_ValidateAccess } from '../src/decorators/ValidateAccess.decorator';
// import { A_SDK_TYPES__Required, A_SDK_TYPES__Dictionary } from '@adaas/a-sdk-types';

// describe('Decorators', () => {
//     it('Should create decorator', async () => {

//         class Test extends A_EXPRESS_EntityController {

//             protected CONTROLLER_CONFIG: A_SDK_TYPES__Required<Partial<A_EXPRESS_TYPES__EntityControllerConfig<A_SDK_TYPES__Dictionary<any>>>, ['entity']> = {
//                 entity: 'users',
//             };

//             @A_EXPRESS_ValidateAccess<Test>((qb, self, req) => {
//                 return qb;
//             })
//             async test() {
//                 return 'test';
//             }
//         }


//         const foo = new Test();

//         await foo.test();

//     });

// });