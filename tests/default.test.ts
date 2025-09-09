import { config } from 'dotenv';
config();
jest.retryTimes(0);
import { A_EXPRESS_Access } from '../src/decorators/A_EXPRESS_Access.decorator';
import { A_SDK_Error } from '@adaas/a-sdk-types';
import { createServer } from 'http';
import express from 'express';
import axios from 'axios';
import { A_EXPRESS_Context } from '@adaas/a-sdk/global/A_EXPRESS_Context.class';
import { A_EXPRESS_TYPES__INextFunction, A_EXPRESS_TYPES__IRequest } from '@adaas/a-sdk/types/A_EXPRESS_Controller.types';
import { A_EXPRESS_Routes } from '@adaas/a-sdk/decorators/A_EXPRESS_Routes.decorator';
import { A_EXPRESS_TYPES__SERVER_COMMANDS_IResponse } from '@adaas/a-sdk/types/A_EXPRESS_ServerCommandsController.types';
import { A_EXPRESS_Controller, A_EXPRESS_ServerDelegate } from '@adaas/a-sdk/decorators/A_EXPRESS_Controller.decorator';
import { A_EXPRESS_Get } from '@adaas/a-sdk/decorators/A_EXPRESS_Methods.decorator';

describe('Defaults', () => {
    it('Should Assign Router', async () => {

        try {

            @A_EXPRESS_Controller()
            class Test {

                @A_EXPRESS_Get({
                    path: '/test',
                    config: {
                        identity: false,
                        auth: false
                    }
                })
                @A_EXPRESS_Access<Test, A_EXPRESS_TYPES__IRequest, ['default', 'test']>({
                    acl: {
                        default: (qb, self, req) => {
                            return qb.action('read');
                        },
                        test: (qb, self, req) => {
                            return qb.action('test');
                        }
                    }
                })
                async test(req: any, res: any, next: any) {
                    console.log('test')

                    return res.status(200).send({
                        message: 'test'
                    });
                }
            }

            const app = express();

            app.use(A_EXPRESS_Routes([Test]));

            const port = 3000;

            (async () => {
                const server = createServer(app);

                await server.listen(
                    port,
                    () => console.info(`Server running on port ${port}`)
                );
            })();


            const resp = await axios.get(`http://localhost:${port}/test`);

            console.log(resp.data);

        } catch (error) {
            A_EXPRESS_Context.Logger.error(new A_SDK_Error(error));
        }
    });


    it('Should Assign Router', async () => {

        try {
            type foo = ({
                magic: string;
            } & {
                id: string;
            }) | ({
                aseid: string;
            } & { scope: string });



            @A_EXPRESS_ServerDelegate('users', (() => { }) as any, {
                id: 'ID',
                auth: {
                    enable: true,
                },
                get: {
                    where: async (self, req) => ({ id: parseInt(req.params.id) })
                }
            })
            class Test {
                async post(
                    req: A_EXPRESS_TYPES__IRequest<foo>,
                    res: A_EXPRESS_TYPES__SERVER_COMMANDS_IResponse,
                    next: A_EXPRESS_TYPES__INextFunction
                ) {
                    const body = req.body;

                    if ('aseid' in body) {
                        console.log(body.aseid)
                    }
                }

            }

        }
        catch (error) {
            A_EXPRESS_Context.Logger.error(new A_SDK_Error(error));
        }

    })


});