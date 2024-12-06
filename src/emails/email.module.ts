/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), 
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
          'image/png',
          'image/jpeg',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new Error('Tipo de archivo no permitido'), false);
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

