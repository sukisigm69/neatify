import { RegisterInput, LoginInput, RegisterOrganizerInput } from "./auth.schema";
export declare const authService: {
    register(input: RegisterInput): Promise<{
        user: any;
        token: string;
    }>;
    login(input: LoginInput): Promise<{
        user: any;
        token: string;
    }>;
    me(userId: string): Promise<any>;
    registerOrganizer(userId: string, input: RegisterOrganizerInput): Promise<{
        id: string;
        user_id: string;
        org_name: string;
        description: string | null;
        logo: string | null;
        website: string | null;
        is_approved: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map