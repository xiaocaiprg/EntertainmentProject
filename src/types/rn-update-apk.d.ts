declare module 'rn-update-apk' {
  export interface UpdateAPKOptions {
    apkVersionUrl?: string;
    fileProviderAuthority?: string;
    needUpdateApp?: (confirmUpdate: (isUpdate: boolean) => void) => void;
    onError?: (error: any) => void;
    skipSignatureCheck?: boolean;
    downloadDestDirectory?: string;
    downloadApkStart?: () => void;
    downloadApkProgress?: (percent: number, contentLength: number, bytesWritten: number) => void;
    downloadApkEnd?: () => void;
  }

  export class UpdateAPK {
    constructor(options: UpdateAPKOptions);
    checkUpdate(): void;
  }
}
