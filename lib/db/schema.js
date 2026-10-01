import {
  pgTable,
  serial,
  text,
  doublePrecision,
  integer,
  date,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),

    name: text("name").notNull(),

    latitude: doublePrecision("latitude").notNull(),

    longitude: doublePrecision("longitude").notNull(),

    isDeleted: boolean("is_deleted")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
);

export const valuations = pgTable("valuations", {
  id: serial("id").primaryKey(),

  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, {
      onDelete: "cascade",
    }),

  rate: doublePrecision("rate").notNull(),

  valuationDate: date("valuation_date").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
},
  (table) => ({
    propertyDateIdx: index(
      "valuations_property_date_idx"
    ).on(
      table.propertyId,
      table.valuationDate
    ),
  })
);