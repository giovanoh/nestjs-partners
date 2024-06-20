/*
  Warnings:

  - A unique constraint covering the columns `[eventId,name]` on the table `Spot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Spot_eventId_name_key` ON `Spot`(`eventId`, `name`);
