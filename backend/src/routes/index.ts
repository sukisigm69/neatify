import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import venueRoutes from "../modules/venue/venue.routes";
import artistRoutes from "../modules/artist/artist.routes";
import eventRoutes from "../modules/event/event.routes";
import ticketCategoryRoutes from "../modules/ticket-category/ticket-category.routes";
import orderRoutes from "../modules/order/order.routes";
import paymentRoutes from "../modules/payment/payment.routes";
import ticketRoutes from "../modules/ticket/ticket.routes";
import organizerRoutes from "../modules/organizer/organizer.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import favoritesRoutes from "../modules/favorites/favorites.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizers", organizerRoutes);
router.use("/venues", venueRoutes);
router.use("/artists", artistRoutes);
router.use("/events", eventRoutes);
router.use("/ticket-categories", ticketCategoryRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/tickets", ticketRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/favorites", favoritesRoutes);

export default router;
