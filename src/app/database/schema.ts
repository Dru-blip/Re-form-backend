import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const usersTable=sqliteTable("users",{
    id:int().primaryKey({autoIncrement:true}),
    name:text(),
    email:text().unique(),
    password:text(),
    createdAt:text("created_at").default(sql`(current_timestamp)`)
})

export const formsTable=sqliteTable("forms",{
    id:int().primaryKey({autoIncrement:true}),
    title:text(),
    description:text(),
    createdAt:text("created_at").default(sql`(current_timestamp)`),
    settingsId:int("settings_id"),
    userId:int("user_id")
})


export const setting=sqliteTable("settings",{
    id:int().primaryKey(),
    confirmationMessage:text("confirmation_message").default("Your response has been recorded"),
    responseLimit:int().default(1),
    editResponse:int({mode:"boolean"}).default(false),
    questionsRequired:int({mode:"boolean"}).default(false),
    anotherResponse:int({mode:"boolean"}).default(false)
})

export const question=sqliteTable("questions",{
    id:int().primaryKey(),
    text:text().default("Untitled"),
    type:text().default()
})