const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Konsera API",
    description: "Concert ticketing platform API. Manage events, tickets, orders, and payments.",
    version: "1.0.0",
    contact: { name: "Konsera", url: "https://konsera.id" },
  },
  servers: [
    { url: "http://localhost:3000/api", description: "Development" },
    { url: "http://localhost:5000/api", description: "Development (alt port)" },
  ],
  tags: [
    { name: "Auth", description: "Authentication & registration" },
    { name: "Organizer", description: "Organizer profile & admin approval" },
    { name: "Venue", description: "Venue management (Admin)" },
    { name: "Artist", description: "Artist management" },
    { name: "Event", description: "Event lifecycle" },
    { name: "Ticket Category", description: "Ticket category management" },
    { name: "Order", description: "Order & checkout" },
    { name: "Payment", description: "Midtrans payment integration" },
    { name: "Ticket", description: "Ticket listing & scanning" },
    { name: "Dashboard", description: "Admin dashboard statistics" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Success" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      PaginatedResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              total: { type: "integer" },
              page: { type: "integer" },
              limit: { type: "integer" },
              totalPages: { type: "integer" },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string", nullable: true },
          avatar: { type: "string", nullable: true },
          is_verified: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          roles: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string", enum: ["USER", "ORGANIZER", "ADMIN", "SUPER_ADMIN"] },
            },
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
        },
      },
      Organizer: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          user_id: { type: "string", format: "uuid" },
          org_name: { type: "string" },
          description: { type: "string", nullable: true },
          logo: { type: "string", nullable: true },
          website: { type: "string", nullable: true },
          is_approved: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Venue: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          province: { type: "string" },
          capacity: { type: "integer" },
          map_url: { type: "string", nullable: true },
          image: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Artist: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          genre: { type: "string", nullable: true },
          bio: { type: "string", nullable: true },
          image: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Event: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          organizer_id: { type: "string", format: "uuid" },
          venue_id: { type: "string", format: "uuid" },
          title: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          banner: { type: "string", nullable: true },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["DRAFT", "PENDING_APPROVAL", "PUBLISHED", "SOLD_OUT", "FINISHED", "CANCELLED"] },
          venues: { $ref: "#/components/schemas/Venue" },
          organizers: { $ref: "#/components/schemas/Organizer" },
          event_artists: {
            type: "array",
            items: {
              type: "object",
              properties: { artists: { $ref: "#/components/schemas/Artist" } },
            },
          },
          ticket_categories: {
            type: "array",
            items: { $ref: "#/components/schemas/TicketCategory" },
          },
        },
      },
      TicketCategory: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          event_id: { type: "string", format: "uuid" },
          name: { type: "string" },
          price: { type: "number", format: "decimal" },
          quota: { type: "integer" },
          sold: { type: "integer" },
          sale_start: { type: "string", format: "date-time" },
          sale_end: { type: "string", format: "date-time" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          user_id: { type: "string", format: "uuid" },
          invoice_number: { type: "string" },
          total_amount: { type: "number", format: "decimal" },
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED", "REFUNDED"] },
          expires_at: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" },
          order_items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                ticket_category_id: { type: "string" },
                quantity: { type: "integer" },
                unit_price: { type: "number" },
                subtotal: { type: "number" },
              },
            },
          },
          payments: { type: "array", items: { $ref: "#/components/schemas/Payment" } },
        },
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          order_id: { type: "string", format: "uuid" },
          amount: { type: "number", format: "decimal" },
          status: { type: "string", enum: ["PENDING", "PAID", "FAILED", "EXPIRED", "REFUNDED"] },
          method: { type: "string", nullable: true },
          snap_token: { type: "string", nullable: true },
          snap_url: { type: "string", nullable: true },
          paid_at: { type: "string", format: "date-time", nullable: true },
        },
      },
      Ticket: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          order_item_id: { type: "string", format: "uuid" },
          qr_code: { type: "string" },
          qr_image: { type: "string", nullable: true },
          attendee_name: { type: "string" },
          attendee_email: { type: "string" },
          attendee_phone: { type: "string" },
          status: { type: "string", enum: ["ACTIVE", "USED", "CANCELLED", "EXPIRED"] },
          created_at: { type: "string", format: "date-time" },
        },
      },
      DashboardStatistics: {
        type: "object",
        properties: {
          totalUsers: { type: "integer", example: 4 },
          totalOrganizers: { type: "integer", example: 1 },
          totalEvents: { type: "integer", example: 3 },
          totalTicketsSold: { type: "integer", example: 0 },
          revenue: { type: "number", example: 0 },
          pendingApproval: { type: "integer", example: 1 },
          pendingPayments: { type: "integer", example: 0 },
        },
      },
      MonthlySales: {
        type: "array",
        items: {
          type: "object",
          properties: {
            month: { type: "integer", example: 1 },
            totalSales: { type: "number", example: 0 },
            totalTransactions: { type: "integer", example: 0 },
          },
        },
      },
      PopularEvent: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          banner: { type: "string", nullable: true },
          status: { type: "string" },
          startDate: { type: "string", format: "date-time" },
          venue: {
            type: "object",
            properties: {
              name: { type: "string" },
              city: { type: "string" },
            },
          },
          totalSold: { type: "integer" },
          totalQuota: { type: "integer" },
        },
      },
      OrganizerDashboardSummary: {
        type: "object",
        properties: {
          organizerId: { type: "string" },
          isApproved: { type: "boolean" },
          totalEvents: { type: "integer" },
          publishedEvents: { type: "integer" },
          totalTicketQuota: { type: "integer" },
          totalTicketsSold: { type: "integer" },
          totalOrders: { type: "integer" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing or invalid token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Missing token" },
          },
        },
      },
      Forbidden: {
        description: "Insufficient permissions",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Forbidden" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Not found" },
          },
        },
      },
      ValidationError: {
        description: "Request body validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              success: false,
              message: "Validation failed",
              errors: [{ field: "email", message: "Invalid email" }],
            },
          },
        },
      },
    },
  },
  paths: {
    // ─── AUTH ───
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 100, example: "John Doe" },
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", minLength: 8, maxLength: 100, example: "Password123!" },
                  phone: { type: "string", maxLength: 20, example: "081234567890" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Registration successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Registration successful" },
                    data: { $ref: "#/components/schemas/AuthResponse" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/ValidationError" },
          409: {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { success: false, message: "Email already registered" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@konsera.id" },
                  password: { type: "string", example: "Admin123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successful" },
                    data: { $ref: "#/components/schemas/AuthResponse" },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { success: false, message: "Invalid credentials" },
              },
            },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/register-organizer": {
      post: {
        tags: ["Auth"],
        summary: "Register as organizer (authenticated user)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orgName"],
                properties: {
                  orgName: { type: "string", minLength: 2, maxLength: 150, example: "My Event Co" },
                  description: { type: "string", example: "Event organizer" },
                  website: { type: "string", format: "uri", example: "https://example.com" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Organizer registration submitted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Organizer registration submitted" },
                    data: { $ref: "#/components/schemas/Organizer" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          409: {
            description: "Already registered as organizer",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { success: false, message: "Already registered as organizer" },
              },
            },
          },
        },
      },
    },

    // ─── ORGANIZER ───
    "/organizers/become": {
      post: {
        tags: ["Organizer"],
        summary: "Become an organizer (USER role only)",
        security: [{ bearerAuth: [] }],
        description: "Requires USER role. Creates organizer profile and changes user role to ORGANIZER.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orgName"],
                properties: {
                  orgName: { type: "string", minLength: 2, maxLength: 150, example: "New Organizer" },
                  description: { type: "string", example: "Event company" },
                  logo: { type: "string", format: "uri", example: "https://example.com/logo.png" },
                  website: { type: "string", format: "uri", example: "https://example.com" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Organizer registration submitted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Organizer" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          409: {
            description: "Already registered as organizer",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { success: false, message: "Already registered as organizer" },
              },
            },
          },
        },
      },
    },
    "/organizers/profile": {
      get: {
        tags: ["Organizer"],
        summary: "Get organizer profile",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Organizer profile",
            content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Organizer" } } } } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Organizer"],
        summary: "Update organizer profile",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  orgName: { type: "string", example: "Updated Org Name" },
                  description: { type: "string" },
                  logo: { type: "string", format: "uri" },
                  website: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated",
            content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Organizer" } } } } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizers/logo": {
      patch: {
        tags: ["Organizer"],
        summary: "Upload organizer logo",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["logo"],
                properties: { logo: { type: "string", format: "uri", example: "https://example.com/logo.png" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Logo updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Organizer" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizers/dashboard/summary": {
      get: {
        tags: ["Organizer"],
        summary: "Organizer dashboard summary",
        description: "Requires ORGANIZER role. Returns event/ticket/order counts for the organizer.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard summary",
            content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/OrganizerDashboardSummary" } } } } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizers/admin/pending": {
      get: {
        tags: ["Organizer"],
        summary: "List pending organizer approvals",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: {
            description: "Paginated pending organizers",
            content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/organizers/admin/{id}/approval": {
      patch: {
        tags: ["Organizer"],
        summary: "Approve or reject organizer",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isApproved"],
                properties: { isApproved: { type: "boolean", example: true } },
              },
            },
          },
        },
        responses: {
          200: { description: "Approval status updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Organizer" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── VENUES ───
    "/venues": {
      get: {
        tags: ["Venue"],
        summary: "List all venues",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Paginated venues", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
      post: {
        tags: ["Venue"],
        summary: "Create venue",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "address", "city", "province", "capacity"],
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 150, example: "GBK Stadium" },
                  address: { type: "string", minLength: 5, example: "Jl. Pintu Satu Senayan" },
                  city: { type: "string", example: "Jakarta" },
                  province: { type: "string", example: "DKI Jakarta" },
                  capacity: { type: "integer", minimum: 1, example: 77193 },
                  mapUrl: { type: "string", format: "uri", example: "https://maps.google.com/?q=GBK" },
                  image: { type: "string", example: "https://example.com/gbk.jpg" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Venue created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Venue" } } } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/venues/{id}": {
      get: {
        tags: ["Venue"],
        summary: "Get venue by ID",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Venue data", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Venue" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Venue"],
        summary: "Update venue",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  address: { type: "string" },
                  city: { type: "string" },
                  province: { type: "string" },
                  capacity: { type: "integer", minimum: 1 },
                  mapUrl: { type: "string", format: "uri" },
                  image: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Venue updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Venue" } } } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Venue"],
        summary: "Delete venue (soft delete)",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Venue deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── ARTISTS ───
    "/artists": {
      get: {
        tags: ["Artist"],
        summary: "List artists",
        description: "Requires ORGANIZER, ADMIN, or SUPER_ADMIN role. Organizers see only artists linked to their events.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Paginated artists", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
      post: {
        tags: ["Artist"],
        summary: "Create artist",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 100, example: "New Artist" },
                  genre: { type: "string", maxLength: 50, example: "Rock" },
                  bio: { type: "string", example: "Artist biography" },
                  image: { type: "string", format: "uri", example: "https://example.com/artist.jpg" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Artist created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Artist" } } } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/artists/{id}": {
      get: {
        tags: ["Artist"],
        summary: "Get artist by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Artist data", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Artist" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Artist"],
        summary: "Update artist",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  genre: { type: "string" },
                  bio: { type: "string" },
                  image: { type: "string", format: "uri" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Artist updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Artist" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Artist"],
        summary: "Delete artist (soft delete)",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Artist deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/artists/{id}/image": {
      patch: {
        tags: ["Artist"],
        summary: "Upload artist image",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["image"],
                properties: { image: { type: "string", format: "uri", example: "https://example.com/new.jpg" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Image updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Artist" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── EVENTS ───
    "/events": {
      get: {
        tags: ["Event"],
        summary: "List published events (public)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" }, description: "Search by title or description" },
        ],
        responses: {
          200: { description: "Paginated published events", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
      post: {
        tags: ["Event"],
        summary: "Create event",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["venueId", "title", "description", "startDate", "endDate"],
                properties: {
                  venueId: { type: "string", format: "uuid", example: "seed-venue-001" },
                  title: { type: "string", minLength: 3, maxLength: 200, example: "New Concert" },
                  description: { type: "string", minLength: 10, example: "A great concert event" },
                  banner: { type: "string", format: "uri" },
                  startDate: { type: "string", format: "date-time", example: "2026-09-15T19:00:00.000Z" },
                  endDate: { type: "string", format: "date-time", example: "2026-09-15T23:00:00.000Z" },
                  artistIds: { type: "array", items: { type: "string", format: "uuid" }, example: ["seed-artist-001"] },
                  ticketCategories: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["name", "price", "quota"],
                      properties: {
                        name: { type: "string", example: "VIP" },
                        price: { type: "number", example: 1500000 },
                        quota: { type: "integer", example: 100 },
                        saleStart: { type: "string", format: "date-time" },
                        saleEnd: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Event created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/events/manage/own": {
      get: {
        tags: ["Event"],
        summary: "List own events (organizer)",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Paginated organizer events", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/events/admin/all": {
      get: {
        tags: ["Event"],
        summary: "List all events (admin)",
        description: "Requires ADMIN or SUPER_ADMIN role. Supports status filter.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "status", in: "query", schema: { type: "string", enum: ["DRAFT", "PENDING_APPROVAL", "PUBLISHED", "SOLD_OUT", "FINISHED", "CANCELLED"] } },
        ],
        responses: {
          200: { description: "Paginated events", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/events/{slug}": {
      get: {
        tags: ["Event"],
        summary: "Get event by slug (public)",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" }, example: "konsera-music-festival-2026" }],
        responses: {
          200: { description: "Event detail", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}": {
      put: {
        tags: ["Event"],
        summary: "Update event",
        description: "Requires ORGANIZER role. Must own the event.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  venueId: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  description: { type: "string" },
                  banner: { type: "string", format: "uri" },
                  startDate: { type: "string", format: "date-time" },
                  endDate: { type: "string", format: "date-time" },
                  artistIds: { type: "array", items: { type: "string", format: "uuid" } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Event updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Event"],
        summary: "Delete event (soft delete)",
        description: "Requires ORGANIZER role. Must own the event.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Event deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/banner": {
      patch: {
        tags: ["Event"],
        summary: "Upload event banner",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["banner"], properties: { banner: { type: "string", format: "uri", example: "https://example.com/banner.jpg" } } } } } },
        responses: {
          200: { description: "Banner updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/gallery": {
      patch: {
        tags: ["Event"],
        summary: "Upload event gallery images",
        description: "Requires ORGANIZER role. Replaces existing gallery.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["images"], properties: { images: { type: "array", items: { type: "string", format: "uri" }, minItems: 1, example: ["https://example.com/1.jpg", "https://example.com/2.jpg"] } } } } } },
        responses: {
          200: { description: "Gallery updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/venue": {
      patch: {
        tags: ["Event"],
        summary: "Assign venue to event",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["venueId"], properties: { venueId: { type: "string", format: "uuid", example: "seed-venue-001" } } } } } },
        responses: {
          200: { description: "Venue assigned", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/artists": {
      patch: {
        tags: ["Event"],
        summary: "Assign artists to event",
        description: "Requires ORGANIZER role. Replaces existing artist assignments.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["artistIds"], properties: { artistIds: { type: "array", items: { type: "string", format: "uuid" }, example: ["seed-artist-001", "seed-artist-002"] } } } } } },
        responses: {
          200: { description: "Artists assigned", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/ticket-categories": {
      post: {
        tags: ["Event"],
        summary: "Create ticket categories for event",
        description: "Requires ORGANIZER role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ticketCategories"],
                properties: {
                  ticketCategories: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["name", "price", "quota"],
                      properties: {
                        name: { type: "string", example: "Gold" },
                        price: { type: "number", example: 1000000 },
                        quota: { type: "integer", example: 50 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Ticket categories created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/submit": {
      patch: {
        tags: ["Event"],
        summary: "Submit event for approval",
        description: "Requires ORGANIZER role. Event must be in DRAFT status.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Event submitted for approval", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          400: { description: "Event is not in DRAFT status", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/approve": {
      patch: {
        tags: ["Event"],
        summary: "Approve event",
        description: "Requires ADMIN or SUPER_ADMIN role. Sets status to PUBLISHED.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Event approved", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/reject": {
      patch: {
        tags: ["Event"],
        summary: "Reject event",
        description: "Requires ADMIN or SUPER_ADMIN role. Sets status to CANCELLED.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Event rejected", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/events/{id}/status": {
      patch: {
        tags: ["Event"],
        summary: "Update event status",
        description: "Requires ADMIN or SUPER_ADMIN role.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["status"], properties: { status: { type: "string", enum: ["PUBLISHED", "CANCELLED"], example: "PUBLISHED" } } } } } },
        responses: {
          200: { description: "Status updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Event" } } } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── TICKET CATEGORIES ───
    "/ticket-categories/event/{eventId}": {
      get: {
        tags: ["Ticket Category"],
        summary: "List ticket categories for event (public)",
        parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string", format: "uuid" }, example: "seed-event-001" }],
        responses: {
          200: {
            description: "List of ticket categories",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/TicketCategory" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Ticket Category"],
        summary: "Create ticket category for event",
        description: "Requires ORGANIZER role. Must own the event.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "eventId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "price", "quota"],
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 100, example: "Silver" },
                  price: { type: "number", minimum: 0, example: 300000 },
                  quota: { type: "integer", minimum: 1, example: 200 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Category created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/TicketCategory" } } } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/ticket-categories/{id}": {
      put: {
        tags: ["Ticket Category"],
        summary: "Update ticket category",
        description: "Requires ORGANIZER role. Must own the event.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "number", minimum: 0 },
                  quota: { type: "integer", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Category updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/TicketCategory" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Ticket Category"],
        summary: "Delete ticket category (soft delete)",
        description: "Requires ORGANIZER role. Must own the event.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Category deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── ORDERS ───
    "/orders/checkout": {
      post: {
        tags: ["Order"],
        summary: "Checkout / create order",
        description: "Requires USER role. Creates order with ticket items, decrements quota. Order expires in 15 minutes.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["eventId", "items"],
                properties: {
                  eventId: { type: "string", format: "uuid", example: "seed-event-001" },
                  items: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      required: ["ticketCategoryId", "quantity"],
                      properties: {
                        ticketCategoryId: { type: "string", format: "uuid", example: "seed-tc-002" },
                        quantity: { type: "integer", minimum: 1, example: 2 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Order created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, message: { type: "string", example: "Order created successfully" }, data: { $ref: "#/components/schemas/Order" } } } } } },
          400: {
            description: "Validation error, insufficient quota, or inactive event",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/orders": {
      get: {
        tags: ["Order"],
        summary: "List orders",
        description: "Authenticated. Users see own orders; admins see all.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Paginated orders", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Order"],
        summary: "Get order by ID",
        description: "Authenticated. Users can only view own orders.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Order detail", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Order" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/orders/{id}/cancel": {
      post: {
        tags: ["Order"],
        summary: "Cancel order",
        description: "Authenticated. Only PENDING orders can be cancelled. Rolls back ticket quotas.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Order cancelled", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, message: { type: "string", example: "Order cancelled successfully" }, data: { $ref: "#/components/schemas/Order" } } } } } },
          400: { description: "Order cannot be cancelled (not PENDING)", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── PAYMENTS ───
    "/payments/snap": {
      post: {
        tags: ["Payment"],
        summary: "Get Midtrans Snap token",
        description: "Authenticated. Returns snap token and redirect URL for payment. Creates payment record if none exists.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: {
                  orderId: { type: "string", format: "uuid", example: "order-uuid-here" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Snap token retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Payment token retrieved" },
                    data: {
                      type: "object",
                      properties: {
                        snapToken: { type: "string" },
                        snapUrl: { type: "string", format: "uri" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Order already processed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/payments/webhook": {
      post: {
        tags: ["Payment"],
        summary: "Midtrans webhook callback",
        description: "Public endpoint called by Midtrans. Verifies SHA-512 signature. Updates payment and order status, generates tickets on success.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  order_id: { type: "string", example: "KNS-20260804-123456" },
                  status_code: { type: "string", example: "200" },
                  gross_amount: { type: "string", example: "1000000.00" },
                  signature_key: { type: "string" },
                  transaction_status: { type: "string", enum: ["capture", "settlement", "pending", "deny", "cancel", "expire"] },
                  fraud_status: { type: "string", enum: ["accept", "challenge", "deny"] },
                  payment_type: { type: "string", example: "bank_transfer" },
                  transaction_id: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Webhook processed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: { success: { type: "boolean", example: true } },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Invalid signature", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── TICKETS ───
    "/tickets": {
      get: {
        tags: ["Ticket"],
        summary: "List tickets",
        description: "Authenticated. Users see own tickets; organizers see tickets for their events.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Paginated tickets", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/tickets/{id}": {
      get: {
        tags: ["Ticket"],
        summary: "Get ticket by ID",
        description: "Authenticated. Users can only view own tickets.",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Ticket detail", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Ticket" } } } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/tickets/scan": {
      post: {
        tags: ["Ticket"],
        summary: "Scan ticket QR code",
        description: "Requires ORGANIZER, ADMIN, or SUPER_ADMIN role. Marks ticket as USED and creates scan log.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["qrCode"],
                properties: {
                  qrCode: { type: "string", format: "uuid", example: "ticket-uuid-here" },
                  location: { type: "string", example: "Gate A" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Scan successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Scan successful" },
                    data: {
                      type: "object",
                      properties: {
                        message: { type: "string", example: "Ticket scanned successfully" },
                        ticket: { $ref: "#/components/schemas/Ticket" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Ticket already used or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  used: { value: { success: false, message: "Ticket has already been used" } },
                  invalid: { value: { success: false, message: "Ticket is invalid (CANCELLED)" } },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: {
            description: "Ticket not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" }, example: { success: false, message: "Ticket not valid" } } },
          },
        },
      },
    },

    // ─── DASHBOARD ───
    "/dashboard/statistics": {
      get: {
        tags: ["Dashboard"],
        summary: "Get admin dashboard statistics",
        description: "Requires ADMIN or SUPER_ADMIN role. Returns aggregated counts for users, organizers, events, tickets, revenue, and pending items.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/DashboardStatistics" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/dashboard/monthly-sales": {
      get: {
        tags: ["Dashboard"],
        summary: "Get monthly sales data",
        description: "Requires ADMIN or SUPER_ADMIN role. Returns 12-month breakdown of sales for the given year.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "year", in: "query", schema: { type: "integer", default: 2026 }, description: "Year to query (defaults to current year)" },
        ],
        responses: {
          200: {
            description: "Monthly sales data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/MonthlySales" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/dashboard/popular-events": {
      get: {
        tags: ["Dashboard"],
        summary: "Get popular events by tickets sold",
        description: "Requires ADMIN or SUPER_ADMIN role. Returns top events ranked by total tickets sold.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 5 }, description: "Number of events to return" },
        ],
        responses: {
          200: {
            description: "Popular events",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/PopularEvent" } },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
  },
};

export default swaggerDocument;
