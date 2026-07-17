import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRootAsync({
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => {
                const uploadPath = configService.get<string>('storage.storagePath');
                const publicPath = configService.get<string>('storage.publicPath');

                if (!uploadPath) {
                    throw new Error('UPLOAD_PATH no está configurado');
                }

                return [
                    {
                        rootPath: join(process.cwd(), uploadPath),
                        serveRoot: publicPath,
                    },
                ];
            },
        }),
    ],
})
export class StaticModule {}
