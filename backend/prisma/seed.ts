import { roles_name } from "@prisma/client";
import { hashSync } from "bcrypt";
import prisma from "../src/lib/prisma";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const roleMap: Record<string, string> = {};
  for (const name of Object.values(roles_name)) {
    const r = await prisma.roles.upsert({
      where: { name },
      update: {},
      create: { id: uuidv4(), name },
    });
    roleMap[name] = r.id;
  }
  console.log(`✓ Seeded ${Object.keys(roleMap).length} roles`);

  const superAdmin = await prisma.users.upsert({
    where: { email: "superadmin@konsera.id" },
    update: { password: hashSync("SuperAdmin123!", 10) },
    create: {
      id: uuidv4(),
      role_id: roleMap["SUPER_ADMIN"],
      name: "Super Admin",
      email: "superadmin@konsera.id",
      password: hashSync("SuperAdmin123!", 10),
      is_verified: true,
    },
  });
  console.log("✓ Seeded super admin (superadmin@konsera.id / SuperAdmin123!)");

  const admin = await prisma.users.upsert({
    where: { email: "admin@konsera.id" },
    update: { password: hashSync("Admin123!", 10) },
    create: {
      id: uuidv4(),
      role_id: roleMap["ADMIN"],
      name: "Admin Konsera",
      email: "admin@konsera.id",
      password: hashSync("Admin123!", 10),
      is_verified: true,
    },
  });
  console.log("✓ Seeded admin (admin@konsera.id / Admin123!)");

  const organizerUser = await prisma.users.upsert({
    where: { email: "organizer@konsera.id" },
    update: { password: hashSync("Organizer123!", 10) },
    create: {
      id: uuidv4(),
      role_id: roleMap["ORGANIZER"],
      name: "Organizer Demo",
      email: "organizer@konsera.id",
      password: hashSync("Organizer123!", 10),
      phone: "081234567890",
      is_verified: true,
    },
  });
  console.log("✓ Seeded organizer user (organizer@konsera.id / Organizer123!)");

  const organizer = await prisma.organizers.upsert({
    where: { user_id: organizerUser.id },
    update: {},
    create: {
      id: uuidv4(),
      user_id: organizerUser.id,
      org_name: "Konsera Entertainment",
      description: "Leading concert organizer in Indonesia",
      website: "https://konsera.id",
      is_approved: true,
    },
  });
  console.log("✓ Seeded organizer profile");

  const regularUser = await prisma.users.upsert({
    where: { email: "user@konsera.id" },
    update: { password: hashSync("User123!", 10) },
    create: {
      id: uuidv4(),
      role_id: roleMap["USER"],
      name: "John Doe",
      email: "user@konsera.id",
      password: hashSync("User123!", 10),
      phone: "081298765432",
      is_verified: true,
    },
  });
  console.log("✓ Seeded regular user (user@konsera.id / User123!)");

  const venue = await prisma.venues.upsert({
    where: { id: "seed-venue-001" },
    update: {},
    create: {
      id: "seed-venue-001",
      name: "Gelora Bung Karno Stadium",
      address: "Jl. Pintu Satu Senayan, Gelora",
      city: "Jakarta",
      province: "DKI Jakarta",
      capacity: 77193,
      map_url: "https://maps.google.com/?q=GBK+Stadium",
      image: "https://example.com/gbk.jpg",
    },
  });

  const venue2 = await prisma.venues.upsert({
    where: { id: "seed-venue-002" },
    update: {},
    create: {
      id: "seed-venue-002",
      name: "Indonesia Convention Exhibition",
      address: "Jl. BSD Grand Boulevard, Pagedangan",
      city: "Tangerang",
      province: "Banten",
      capacity: 50000,
      map_url: "https://maps.google.com/?q=ICE+BSD",
      image: "https://example.com/ice.jpg",
    },
  });
  console.log("✓ Seeded 2 venues");

  const artist1 = await prisma.artists.upsert({
    where: { id: "seed-artist-001" },
    update: {},
    create: {
      id: "seed-artist-001",
      name: "Tulus",
      genre: "Pop",
      bio: "Indonesian singer-songwriter known for his soulful voice",
      image: "https://example.com/tulus.jpg",
    },
  });

  const artist2 = await prisma.artists.upsert({
    where: { id: "seed-artist-002" },
    update: {},
    create: {
      id: "seed-artist-002",
      name: "Nadin Amizah",
      genre: "Indie Pop",
      bio: "Rising Indonesian indie pop artist",
      image: "https://example.com/nadin.jpg",
    },
  });

  const artist3 = await prisma.artists.upsert({
    where: { id: "seed-artist-003" },
    update: {},
    create: {
      id: "seed-artist-003",
      name: "Pamungkas",
      genre: "Indie",
      bio: "Indonesian singer-songwriter and multi-instrumentalist",
      image: "https://example.com/pamungkas.jpg",
    },
  });
  console.log("✓ Seeded 3 artists");

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
  const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 16);

  const event1 = await prisma.events.upsert({
    where: { slug: "konsera-music-festival-2026" },
    update: {},
    create: {
      id: "seed-event-001",
      organizer_id: organizer.id,
      venue_id: venue.id,
      title: "Konsera Music Festival 2026",
      slug: "konsera-music-festival-2026",
      description: "The biggest music festival in Indonesia featuring top local and international artists. Join us for an unforgettable experience!",
      banner: "https://example.com/festival-banner.jpg",
      start_date: nextMonth,
      end_date: nextMonthEnd,
      status: "PUBLISHED",
    },
  });

  const twoMonths = new Date(now.getFullYear(), now.getMonth() + 2, 20);
  const twoMonthsEnd = new Date(now.getFullYear(), now.getMonth() + 2, 20, 23);

  const event2 = await prisma.events.upsert({
    where: { slug: "tulus-intimate-concert" },
    update: {},
    create: {
      id: "seed-event-002",
      organizer_id: organizer.id,
      venue_id: venue2.id,
      title: "Tulus Intimate Concert",
      slug: "tulus-intimate-concert",
      description: "An intimate evening with Tulus performing his greatest hits in an acoustic setting.",
      banner: "https://example.com/tulus-concert.jpg",
      start_date: twoMonths,
      end_date: twoMonthsEnd,
      status: "PUBLISHED",
    },
  });

  const event3 = await prisma.events.upsert({
    where: { slug: "indie-night-vol-3" },
    update: {},
    create: {
      id: "seed-event-003",
      organizer_id: organizer.id,
      venue_id: venue.id,
      title: "Indie Night Vol. 3",
      slug: "indie-night-vol-3",
      description: "A showcase of the best indie artists in the country.",
      start_date: new Date(now.getFullYear(), now.getMonth() + 3, 10),
      end_date: new Date(now.getFullYear(), now.getMonth() + 3, 10, 23),
      status: "PENDING_APPROVAL",
    },
  });
  console.log("✓ Seeded 3 events (2 published, 1 pending)");

  await prisma.event_artists.deleteMany({ where: { event_id: event1.id } });
  await prisma.event_artists.createMany({
    data: [
      { event_id: event1.id, artist_id: artist1.id },
      { event_id: event1.id, artist_id: artist2.id },
      { event_id: event1.id, artist_id: artist3.id },
    ],
    skipDuplicates: true,
  });
  await prisma.event_artists.deleteMany({ where: { event_id: event2.id } });
  await prisma.event_artists.createMany({
    data: [{ event_id: event2.id, artist_id: artist1.id }],
    skipDuplicates: true,
  });
  console.log("✓ Linked artists to events");

  const saleStart = new Date();
  const saleEnd = new Date(nextMonth.getTime() - 24 * 60 * 60 * 1000);

  await prisma.ticket_categories.upsert({
    where: { id: "seed-tc-001" },
    update: {},
    create: {
      id: "seed-tc-001",
      event_id: event1.id,
      name: "VIP",
      price: 1500000,
      quota: 100,
      sold: 0,
      sale_start: saleStart,
      sale_end: saleEnd,
    },
  });

  await prisma.ticket_categories.upsert({
    where: { id: "seed-tc-002" },
    update: {},
    create: {
      id: "seed-tc-002",
      event_id: event1.id,
      name: "Regular",
      price: 500000,
      quota: 500,
      sold: 0,
      sale_start: saleStart,
      sale_end: saleEnd,
    },
  });

  await prisma.ticket_categories.upsert({
    where: { id: "seed-tc-003" },
    update: {},
    create: {
      id: "seed-tc-003",
      event_id: event1.id,
      name: "Tribune",
      price: 250000,
      quota: 1000,
      sold: 0,
      sale_start: saleStart,
      sale_end: saleEnd,
    },
  });

  const saleEnd2 = new Date(twoMonths.getTime() - 24 * 60 * 60 * 1000);

  await prisma.ticket_categories.upsert({
    where: { id: "seed-tc-004" },
    update: {},
    create: {
      id: "seed-tc-004",
      event_id: event2.id,
      name: "Front Row",
      price: 2000000,
      quota: 50,
      sold: 0,
      sale_start: saleStart,
      sale_end: saleEnd2,
    },
  });

  await prisma.ticket_categories.upsert({
    where: { id: "seed-tc-005" },
    update: {},
    create: {
      id: "seed-tc-005",
      event_id: event2.id,
      name: "General",
      price: 750000,
      quota: 200,
      sold: 0,
      sale_start: saleStart,
      sale_end: saleEnd2,
    },
  });
  console.log("✓ Seeded 5 ticket categories");

  console.log("\n========================================");
  console.log("  SEED COMPLETE - Test Credentials:");
  console.log("========================================");
  console.log("Super Admin : superadmin@konsera.id / SuperAdmin123!");
  console.log("Admin       : admin@konsera.id / Admin123!");
  console.log("Organizer   : organizer@konsera.id / Organizer123!");
  console.log("User        : user@konsera.id / User123!");
  console.log("========================================");
  console.log("\nSample IDs:");
  console.log(`Venue 1     : ${venue.id}`);
  console.log(`Venue 2     : ${venue2.id}`);
  console.log(`Artist 1    : ${artist1.id}`);
  console.log(`Artist 2    : ${artist2.id}`);
  console.log(`Artist 3    : ${artist3.id}`);
  console.log(`Event 1     : ${event1.id} (PUBLISHED)`);
  console.log(`Event 2     : ${event2.id} (PUBLISHED)`);
  console.log(`Event 3     : ${event3.id} (PENDING_APPROVAL)`);
  console.log(`TC VIP      : seed-tc-001`);
  console.log(`TC Regular  : seed-tc-002`);
  console.log(`TC Tribune  : seed-tc-003`);
  console.log(`TC FrontRow : seed-tc-004`);
  console.log(`TC General  : seed-tc-005`);
  console.log("========================================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
