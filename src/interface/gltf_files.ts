export interface IGLTFFile {
    key: string,
    path: string,
    size: number,
}

export interface IGLTFRefFileInfo {
    key: string,
    path: string,
    bins: IGLTFFile[],
    images: IGLTFFile[],
}