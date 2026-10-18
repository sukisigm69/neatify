import { CreateArtistInput, UpdateArtistInput } from "./artist.schema";
export declare const artistService: {
    listOwn(userId: string, page: number, limit: number): Promise<{
        artists: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    listAll(page: number, limit: number): Promise<{
        artists: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<any>;
    create(userId: string, data: CreateArtistInput): Promise<any>;
    update(userId: string, id: string, data: UpdateArtistInput): Promise<any>;
    uploadImage(userId: string, id: string, image: string): Promise<any>;
    remove(userId: string, id: string): Promise<any>;
};
//# sourceMappingURL=artist.service.d.ts.map