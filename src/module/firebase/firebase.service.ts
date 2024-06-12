import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FirebaseStorage,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { firebaseConfig } from '../../configs/firebase.config';

@Injectable()
export class FirebaseService {
  private firebaseApp: FirebaseApp;
  private fibaseStorage: FirebaseStorage;

  constructor(private readonly configServive: ConfigService) {
    this.firebaseApp = initializeApp(firebaseConfig(this.configServive));
    this.fibaseStorage = getStorage(this.firebaseApp);
  }

  /**
   * url for access to file
   * @param filePath path for referent to file
   * @returns download-url
   */
  async getFileUrl(filePath: string): Promise<string> {
    try {
      const storageRef = ref(this.fibaseStorage, filePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      if (error?.code === 'storage/object-not-found') {
        throw new NotFoundException('File not found');
      }

      throw error;
    }
  }

  /**
   * upload file to firebase storage
   * @param file file upload from client via multer
   * @returns path and url
   */
  async uploadFile(file: Express.Multer.File) {
    try {
      const extension: string = path.parse(file.originalname).ext;
      const storageRef = ref(this.fibaseStorage, `${randomUUID()}`);
      const metadata = {
        contentType: file?.mimetype,
        customMetadata: {
          extension,
        },
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata,
      );
      return {
        path: snapshot.ref.fullPath,
        url: await getDownloadURL(snapshot.ref),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * update file exist
   * @param file file upload from client via multer
   * @param filePath path for referent to file
   * @returns path and url
   */
  async updateFile(file: Express.Multer.File, filePath: string) {
    try {
      const extension: string = path.parse(file.originalname).ext;
      const storageRef = ref(this.fibaseStorage, filePath);
      const metadata = {
        contentType: file?.mimetype,
        customMetadata: {
          extension,
        },
      };
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata,
      );
      return {
        path: snapshot.ref.fullPath,
        url: await getDownloadURL(snapshot.ref),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * delete file from firebase storage
   * @param filePath path for referent to file
   */
  async deleteFile(filePath: string) {
    const storageRef = ref(this.fibaseStorage, filePath);

    try {
      await deleteObject(storageRef);

      return {
        message: 'Delete file success',
      };
    } catch (error) {
      if (error?.code === 'storage/object-not-found') {
        throw new NotFoundException('File not found');
      }

      throw error;
    }
  }
}
