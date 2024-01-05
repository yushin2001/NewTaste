import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
  index,
  unique,
} from "drizzle-orm/pg-core";

// Tables
export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }).notNull(),
    image: text("user_image"),
  },
  (table) => ({
    displayIdIndex: index("user_display_id_index").on(table.displayId),
  }),
);

export const eventsTable = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    latest_time: varchar("latest_time").notNull(),
    categoryName: varchar("category_name", { length: 100 }).notNull(),
    location: varchar("location", { length: 100 }).notNull(),
  },
  (table) => ({
    displayIdIndex: index("event_display_id_index").on(table.displayId),
    userIdIndex: index("event_user_id_index").on(table.userId),
  }),
);

export const foodTable = pgTable(
  "food",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    eventId: uuid("event_id").references(() => eventsTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    name: varchar("name").notNull(),
    count: integer("count").notNull(),
    image: text("image"),
  },
  (table) => ({
    displayIdIndex: index("food_display_id_index").on(table.displayId),
    eventIdIndex: index("event_id_index").on(table.eventId),
  }),
);

export const subscriptionsTable = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    subscriberId: uuid("subscriber_id").references(() => usersTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    subscribedUserId: uuid("subscribed_user_id").references(
      () => usersTable.displayId,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    ),
  },
  (table) => ({
    subscriberIdIndex: index("subscriber_id_index").on(table.subscriberId),
    subscribedUserIdIndex: index("subscribedUser_id_index").on(
      table.subscribedUserId,
    ),
    // 每個subscriberId和subscribedUserId的組合都是unique
    uniqCombination: unique().on(table.subscriberId, table.subscribedUserId),
  }),
  // This is a unique constraint on the combination of userId and documentId.
  // This ensures that there is no duplicate entry in the table.
);

export const reservationTable = pgTable(
  "reservations",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => usersTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    foodId: uuid("food_id").references(() => foodTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    count: integer("count").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    // displayIdIndex: index("display_id_index").on(table.displayId),
    userIdIndex: index("reservation_user_id_index").on(table.userId),
    foodIdIndex: index("food_id_index").on(table.foodId),
    uniqCombination: unique().on(table.userId, table.foodId),
  }),
);

/*
Relations

兩個table的關係要在各自的relation都有定義
*/

// user對其他table的relation
// user對其他table的relation
export const usersRelations = relations(usersTable, ({ many }) => ({
  // 每個user可以有（建立）n個event
  events: many(eventsTable),
  // // 每個user可以有（建立）n個food
  // foodTable: many(foodTable),
  // 每個user可以有（建立）n個reservation
  reservations: many(reservationTable),
  // 每個user可以有n個subscriber
  subscribers: many(subscriptionsTable, {
    relationName: "subscribedUser",
  }),
  // 每個user可以有n個subscribedUser
  subscribedUsers: many(subscriptionsTable, {
    relationName: "subscriber",
  }),
}));

// event對其他table的relation
export const eventsRelation = relations(eventsTable, ({ one }) => ({
  // 每個event有1個creator (user)
  creator: one(usersTable, {
    // eventsTable的哪個欄位是外鍵
    fields: [eventsTable.userId],
    // 外鍵參照到usersTable的欄位（主鍵）
    references: [usersTable.displayId],
  }),
}));

// food對其他table的relation
export const foodRelation = relations(foodTable, ({ one }) => ({
  // 每個food有1個event
  event: one(eventsTable, {
    // foodTable的哪個欄位是外鍵
    fields: [foodTable.eventId],
    // 外鍵參照到eventsTable的欄位（主鍵）
    references: [eventsTable.displayId],
  }),
}));

// reservation對其他table的relation
export const reservationRelation = relations(reservationTable, ({ one }) => ({
  // 每個reservation有1個user
  user: one(usersTable, {
    // reservationTable的哪個欄位是外鍵
    fields: [reservationTable.userId],
    // 外鍵參照到usersTable的欄位（主鍵）
    references: [usersTable.displayId],
  }),
  // 每個reservation有1個food
  food: one(foodTable, {
    // reservationTable的哪個欄位是外鍵
    fields: [reservationTable.foodId],
    // 外鍵參照到foodTable的欄位（主鍵）
    references: [foodTable.displayId],
  }),
}));

// subscription對其他table的relation
export const subscriptionRelation = relations(
  subscriptionsTable,
  ({ one }) => ({
    // 每個subscription有1個subscriber
    subscriber: one(usersTable, {
      // subscriptionsTable的哪個欄位是外鍵
      fields: [subscriptionsTable.subscriberId],
      // 外鍵參照到usersTable的欄位（主鍵）
      references: [usersTable.displayId],
      // 用來區別對到同一個table的不同relation
      relationName: "subscriber",
    }),

    // 每個subscription有1個subscribedUser
    subscribedUser: one(usersTable, {
      // subscriptionsTable的哪個欄位是外鍵
      fields: [subscriptionsTable.subscribedUserId],
      // 外鍵參照到usersTable的欄位（主鍵）
      references: [usersTable.displayId],
      // 用來區別對到同一個table的不同relation
      relationName: "subscribedUser",
    }),
  }),
);
