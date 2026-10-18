declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
        contact: {
            name: string;
            url: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            SuccessResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    data: {
                        type: string;
                    };
                };
            };
            ErrorResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    errors: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                field: {
                                    type: string;
                                };
                                message: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
            PaginatedResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    message: {
                        type: string;
                    };
                    data: {
                        type: string;
                        properties: {
                            total: {
                                type: string;
                            };
                            page: {
                                type: string;
                            };
                            limit: {
                                type: string;
                            };
                            totalPages: {
                                type: string;
                            };
                        };
                    };
                };
            };
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    phone: {
                        type: string;
                        nullable: boolean;
                    };
                    avatar: {
                        type: string;
                        nullable: boolean;
                    };
                    is_verified: {
                        type: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                    roles: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                            name: {
                                type: string;
                                enum: string[];
                            };
                        };
                    };
                };
            };
            AuthResponse: {
                type: string;
                properties: {
                    user: {
                        $ref: string;
                    };
                    token: {
                        type: string;
                        example: string;
                    };
                };
            };
            Organizer: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    user_id: {
                        type: string;
                        format: string;
                    };
                    org_name: {
                        type: string;
                    };
                    description: {
                        type: string;
                        nullable: boolean;
                    };
                    logo: {
                        type: string;
                        nullable: boolean;
                    };
                    website: {
                        type: string;
                        nullable: boolean;
                    };
                    is_approved: {
                        type: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            Venue: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    address: {
                        type: string;
                    };
                    city: {
                        type: string;
                    };
                    province: {
                        type: string;
                    };
                    capacity: {
                        type: string;
                    };
                    map_url: {
                        type: string;
                        nullable: boolean;
                    };
                    image: {
                        type: string;
                        nullable: boolean;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            Artist: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    genre: {
                        type: string;
                        nullable: boolean;
                    };
                    bio: {
                        type: string;
                        nullable: boolean;
                    };
                    image: {
                        type: string;
                        nullable: boolean;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            Event: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    organizer_id: {
                        type: string;
                        format: string;
                    };
                    venue_id: {
                        type: string;
                        format: string;
                    };
                    title: {
                        type: string;
                    };
                    slug: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    banner: {
                        type: string;
                        nullable: boolean;
                    };
                    start_date: {
                        type: string;
                        format: string;
                    };
                    end_date: {
                        type: string;
                        format: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    venues: {
                        $ref: string;
                    };
                    organizers: {
                        $ref: string;
                    };
                    event_artists: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                artists: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    ticket_categories: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
            };
            TicketCategory: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    event_id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    price: {
                        type: string;
                        format: string;
                    };
                    quota: {
                        type: string;
                    };
                    sold: {
                        type: string;
                    };
                    sale_start: {
                        type: string;
                        format: string;
                    };
                    sale_end: {
                        type: string;
                        format: string;
                    };
                };
            };
            Order: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    user_id: {
                        type: string;
                        format: string;
                    };
                    invoice_number: {
                        type: string;
                    };
                    total_amount: {
                        type: string;
                        format: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    expires_at: {
                        type: string;
                        format: string;
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                    order_items: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                };
                                ticket_category_id: {
                                    type: string;
                                };
                                quantity: {
                                    type: string;
                                };
                                unit_price: {
                                    type: string;
                                };
                                subtotal: {
                                    type: string;
                                };
                            };
                        };
                    };
                    payments: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
            };
            Payment: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    order_id: {
                        type: string;
                        format: string;
                    };
                    amount: {
                        type: string;
                        format: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    method: {
                        type: string;
                        nullable: boolean;
                    };
                    snap_token: {
                        type: string;
                        nullable: boolean;
                    };
                    snap_url: {
                        type: string;
                        nullable: boolean;
                    };
                    paid_at: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                };
            };
            Ticket: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    order_item_id: {
                        type: string;
                        format: string;
                    };
                    qr_code: {
                        type: string;
                    };
                    qr_image: {
                        type: string;
                        nullable: boolean;
                    };
                    attendee_name: {
                        type: string;
                    };
                    attendee_email: {
                        type: string;
                    };
                    attendee_phone: {
                        type: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    created_at: {
                        type: string;
                        format: string;
                    };
                };
            };
            DashboardStatistics: {
                type: string;
                properties: {
                    totalUsers: {
                        type: string;
                        example: number;
                    };
                    totalOrganizers: {
                        type: string;
                        example: number;
                    };
                    totalEvents: {
                        type: string;
                        example: number;
                    };
                    totalTicketsSold: {
                        type: string;
                        example: number;
                    };
                    revenue: {
                        type: string;
                        example: number;
                    };
                    pendingApproval: {
                        type: string;
                        example: number;
                    };
                    pendingPayments: {
                        type: string;
                        example: number;
                    };
                };
            };
            MonthlySales: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        month: {
                            type: string;
                            example: number;
                        };
                        totalSales: {
                            type: string;
                            example: number;
                        };
                        totalTransactions: {
                            type: string;
                            example: number;
                        };
                    };
                };
            };
            PopularEvent: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    title: {
                        type: string;
                    };
                    slug: {
                        type: string;
                    };
                    banner: {
                        type: string;
                        nullable: boolean;
                    };
                    status: {
                        type: string;
                    };
                    startDate: {
                        type: string;
                        format: string;
                    };
                    venue: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                            };
                            city: {
                                type: string;
                            };
                        };
                    };
                    totalSold: {
                        type: string;
                    };
                    totalQuota: {
                        type: string;
                    };
                };
            };
            OrganizerDashboardSummary: {
                type: string;
                properties: {
                    organizerId: {
                        type: string;
                    };
                    isApproved: {
                        type: string;
                    };
                    totalEvents: {
                        type: string;
                    };
                    publishedEvents: {
                        type: string;
                    };
                    totalTicketQuota: {
                        type: string;
                    };
                    totalTicketsSold: {
                        type: string;
                    };
                    totalOrders: {
                        type: string;
                    };
                };
            };
        };
        responses: {
            Unauthorized: {
                description: string;
                content: {
                    "application/json": {
                        schema: {
                            $ref: string;
                        };
                        example: {
                            success: boolean;
                            message: string;
                        };
                    };
                };
            };
            Forbidden: {
                description: string;
                content: {
                    "application/json": {
                        schema: {
                            $ref: string;
                        };
                        example: {
                            success: boolean;
                            message: string;
                        };
                    };
                };
            };
            NotFound: {
                description: string;
                content: {
                    "application/json": {
                        schema: {
                            $ref: string;
                        };
                        example: {
                            success: boolean;
                            message: string;
                        };
                    };
                };
            };
            ValidationError: {
                description: string;
                content: {
                    "application/json": {
                        schema: {
                            $ref: string;
                        };
                        example: {
                            success: boolean;
                            message: string;
                            errors: {
                                field: string;
                                message: string;
                            }[];
                        };
                    };
                };
            };
        };
    };
    paths: {
        "/auth/register": {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    email: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    password: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    phone: {
                                        type: string;
                                        maxLength: number;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        $ref: string;
                    };
                    409: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                                example: {
                                    success: boolean;
                                    message: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/auth/login": {
            post: {
                tags: string[];
                summary: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    password: {
                                        type: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                                example: {
                                    success: boolean;
                                    message: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/auth/me": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                };
            };
        };
        "/auth/register-organizer": {
            post: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    orgName: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    description: {
                                        type: string;
                                        example: string;
                                    };
                                    website: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    409: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                                example: {
                                    success: boolean;
                                    message: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/organizers/become": {
            post: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    orgName: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    description: {
                                        type: string;
                                        example: string;
                                    };
                                    logo: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    website: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    409: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                                example: {
                                    success: boolean;
                                    message: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/organizers/profile": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    orgName: {
                                        type: string;
                                        example: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    logo: {
                                        type: string;
                                        format: string;
                                    };
                                    website: {
                                        type: string;
                                        format: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/organizers/logo": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    logo: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/organizers/dashboard/summary": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/organizers/admin/pending": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/organizers/admin/{id}/approval": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    isApproved: {
                                        type: string;
                                        example: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/venues": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    address: {
                                        type: string;
                                        minLength: number;
                                        example: string;
                                    };
                                    city: {
                                        type: string;
                                        example: string;
                                    };
                                    province: {
                                        type: string;
                                        example: string;
                                    };
                                    capacity: {
                                        type: string;
                                        minimum: number;
                                        example: number;
                                    };
                                    mapUrl: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    image: {
                                        type: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        $ref: string;
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/venues/{id}": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    address: {
                                        type: string;
                                    };
                                    city: {
                                        type: string;
                                    };
                                    province: {
                                        type: string;
                                    };
                                    capacity: {
                                        type: string;
                                        minimum: number;
                                    };
                                    mapUrl: {
                                        type: string;
                                        format: string;
                                    };
                                    image: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        $ref: string;
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/artists": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    genre: {
                                        type: string;
                                        maxLength: number;
                                        example: string;
                                    };
                                    bio: {
                                        type: string;
                                        example: string;
                                    };
                                    image: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        $ref: string;
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/artists/{id}": {
            get: {
                tags: string[];
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
            put: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    genre: {
                                        type: string;
                                    };
                                    bio: {
                                        type: string;
                                    };
                                    image: {
                                        type: string;
                                        format: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/artists/{id}/image": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    image: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events": {
            get: {
                tags: string[];
                summary: string;
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                    description?: undefined;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        default?: undefined;
                        type: string;
                    };
                    description: string;
                })[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    venueId: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    title: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    description: {
                                        type: string;
                                        minLength: number;
                                        example: string;
                                    };
                                    banner: {
                                        type: string;
                                        format: string;
                                    };
                                    startDate: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    endDate: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    artistIds: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                        example: string[];
                                    };
                                    ticketCategories: {
                                        type: string;
                                        items: {
                                            type: string;
                                            required: string[];
                                            properties: {
                                                name: {
                                                    type: string;
                                                    example: string;
                                                };
                                                price: {
                                                    type: string;
                                                    example: number;
                                                };
                                                quota: {
                                                    type: string;
                                                    example: number;
                                                };
                                                saleStart: {
                                                    type: string;
                                                    format: string;
                                                };
                                                saleEnd: {
                                                    type: string;
                                                    format: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        $ref: string;
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/manage/own": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/admin/all": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                        enum?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        default?: undefined;
                        type: string;
                        enum: string[];
                    };
                })[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{slug}": {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                    example: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}": {
            put: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    venueId: {
                                        type: string;
                                        format: string;
                                    };
                                    title: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    banner: {
                                        type: string;
                                        format: string;
                                    };
                                    startDate: {
                                        type: string;
                                        format: string;
                                    };
                                    endDate: {
                                        type: string;
                                        format: string;
                                    };
                                    artistIds: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/banner": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    banner: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/gallery": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    images: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                        minItems: number;
                                        example: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/venue": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    venueId: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/artists": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    artistIds: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                        example: string[];
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/ticket-categories": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    ticketCategories: {
                                        type: string;
                                        items: {
                                            type: string;
                                            required: string[];
                                            properties: {
                                                name: {
                                                    type: string;
                                                    example: string;
                                                };
                                                price: {
                                                    type: string;
                                                    example: number;
                                                };
                                                quota: {
                                                    type: string;
                                                    example: number;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/submit": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/approve": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/reject": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/events/{id}/status": {
            patch: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    status: {
                                        type: string;
                                        enum: string[];
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        $ref: string;
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/ticket-categories/event/{eventId}": {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                    example: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    name: {
                                        type: string;
                                        minLength: number;
                                        maxLength: number;
                                        example: string;
                                    };
                                    price: {
                                        type: string;
                                        minimum: number;
                                        example: number;
                                    };
                                    quota: {
                                        type: string;
                                        minimum: number;
                                        example: number;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        $ref: string;
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/ticket-categories/{id}": {
            put: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    price: {
                                        type: string;
                                        minimum: number;
                                    };
                                    quota: {
                                        type: string;
                                        minimum: number;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
            delete: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/orders/checkout": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    eventId: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    items: {
                                        type: string;
                                        minItems: number;
                                        items: {
                                            type: string;
                                            required: string[];
                                            properties: {
                                                ticketCategoryId: {
                                                    type: string;
                                                    format: string;
                                                    example: string;
                                                };
                                                quantity: {
                                                    type: string;
                                                    minimum: number;
                                                    example: number;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    201: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/orders": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                };
            };
        };
        "/orders/{id}": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/orders/{id}/cancel": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/payments/snap": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    orderId: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                snapToken: {
                                                    type: string;
                                                };
                                                snapUrl: {
                                                    type: string;
                                                    format: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/payments/webhook": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    order_id: {
                                        type: string;
                                        example: string;
                                    };
                                    status_code: {
                                        type: string;
                                        example: string;
                                    };
                                    gross_amount: {
                                        type: string;
                                        example: string;
                                    };
                                    signature_key: {
                                        type: string;
                                    };
                                    transaction_status: {
                                        type: string;
                                        enum: string[];
                                    };
                                    fraud_status: {
                                        type: string;
                                        enum: string[];
                                    };
                                    payment_type: {
                                        type: string;
                                        example: string;
                                    };
                                    transaction_id: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                success: {
                                                    type: string;
                                                    example: boolean;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/tickets": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                };
            };
        };
        "/tickets/{id}": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        $ref: string;
                    };
                };
            };
        };
        "/tickets/scan": {
            post: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    qrCode: {
                                        type: string;
                                        format: string;
                                        example: string;
                                    };
                                    location: {
                                        type: string;
                                        example: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        data: {
                                            type: string;
                                            properties: {
                                                message: {
                                                    type: string;
                                                    example: string;
                                                };
                                                ticket: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    400: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                                examples: {
                                    used: {
                                        value: {
                                            success: boolean;
                                            message: string;
                                        };
                                    };
                                    invalid: {
                                        value: {
                                            success: boolean;
                                            message: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                    404: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: string;
                                };
                                example: {
                                    success: boolean;
                                    message: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        "/dashboard/statistics": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/dashboard/monthly-sales": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                    description: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
        "/dashboard/popular-events": {
            get: {
                tags: string[];
                summary: string;
                description: string;
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                    description: string;
                }[];
                responses: {
                    200: {
                        description: string;
                        content: {
                            "application/json": {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                            example: boolean;
                                        };
                                        data: {
                                            type: string;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    401: {
                        $ref: string;
                    };
                    403: {
                        $ref: string;
                    };
                };
            };
        };
    };
};
export default swaggerDocument;
//# sourceMappingURL=swagger.d.ts.map