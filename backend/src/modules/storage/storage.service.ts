import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly isMockMode = process.env.STORAGE_MODE === 'mock';
  private readonly gcpBucketName = process.env.GCP_BUCKET_NAME || 'cmpc-libros-bucket';
  private readonly gcpProjectId = process.env.GCP_PROJECT_ID || 'cmpc-libros-project';

  /**
   * Simula la subida de archivo a GCP Storage
   * En modo MOCK retorna una URL aleatoria simulada
   * En modo PRODUCCIÓN usaría el SDK real de GCP
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (this.isMockMode) {
      return this.mockUpload(file);
    }
    
    // TODO: Implementar upload real a GCP
    return this.realGcpUpload(file);
  }

  /**
   * Modo MOCK: Genera una URL aleatoria simulando GCP Storage
   */
  private mockUpload(file: Express.Multer.File): string {
    const randomId = this.generateRandomId(16);
    const timestamp = Date.now();
    const extension = this.getFileExtension(file.originalname);
    const filename = `books/${timestamp}-${randomId}${extension}`;
    
    // URL simulada de GCP Storage
    const mockUrl = `https://storage.googleapis.com/${this.gcpBucketName}/${filename}`;
    
    this.logger.log(`[MOCK] Simulated upload to GCP Storage`);
    this.logger.log(`[MOCK] File: ${file.originalname} (${file.size} bytes)`);
    this.logger.log(`[MOCK] Generated URL: ${mockUrl}`);
    
    return mockUrl;
  }

  /**
   * Modo PRODUCCIÓN: Sube archivo real a GCP Storage
   * Requiere: @google-cloud/storage instalado y configurado
   */
  private async realGcpUpload(file: Express.Multer.File): Promise<string> {
    // TODO: Implementar cuando se requiera producción
    // const { Storage } = require('@google-cloud/storage');
    // const storage = new Storage({
    //   projectId: this.gcpProjectId,
    //   keyFilename: process.env.GCP_KEYFILE_PATH,
    // });
    // 
    // const bucket = storage.bucket(this.gcpBucketName);
    // const randomId = this.generateRandomId(16);
    // const timestamp = Date.now();
    // const extension = this.getFileExtension(file.originalname);
    // const filename = `books/${timestamp}-${randomId}${extension}`;
    // const blob = bucket.file(filename);
    //
    // await blob.save(file.buffer, {
    //   contentType: file.mimetype,
    //   public: true,
    // });
    //
    // return blob.publicUrl();

    this.logger.warn('Real GCP upload not implemented yet. Using mock mode.');
    return this.mockUpload(file);
  }

  /**
   * Simula la eliminación de archivo de GCP Storage
   */
  async deleteFile(fileUrl: string): Promise<void> {
    if (this.isMockMode) {
      this.logger.log(`[MOCK] Simulated deletion from GCP Storage: ${fileUrl}`);
      return;
    }

    // TODO: Implementar eliminación real
    // const filename = this.extractFilenameFromUrl(fileUrl);
    // const { Storage } = require('@google-cloud/storage');
    // const storage = new Storage({ projectId: this.gcpProjectId });
    // const bucket = storage.bucket(this.gcpBucketName);
    // await bucket.file(filename).delete();
  }

  /**
   * Genera un ID aleatorio hexadecimal
   */
  private generateRandomId(length: number): string {
    return Array(length)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
  }

  /**
   * Obtiene la extensión del archivo
   */
  private getFileExtension(filename: string): string {
    const ext = filename.match(/\.[^.]+$/);
    return ext ? ext[0] : '';
  }

  /**
   * Extrae el nombre del archivo de la URL de GCP
   */
  private extractFilenameFromUrl(url: string): string {
    const match = url.match(/\/([^/]+)$/);
    return match ? match[1] : '';
  }
}
