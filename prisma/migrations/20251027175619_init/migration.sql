-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_CONTACTED', 'CONTACTED', 'RESPONSIVE', 'QUOTING', 'CONTRACTED', 'NON_RESPONSIVE');

-- CreateTable
CREATE TABLE "Contractor" (
    "id" TEXT NOT NULL,
    "placeId" TEXT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "mainService" TEXT NOT NULL,
    "keywords" TEXT,
    "contactInfo" JSONB,
    "status" "Status" NOT NULL DEFAULT 'NOT_CONTACTED',
    "assignedToId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "contractorId" TEXT,
    "fromStatus" "Status",
    "toStatus" "Status",
    "fromAssignee" TEXT,
    "toAssignee" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contractor_placeId_key" ON "Contractor"("placeId");

-- CreateIndex
CREATE INDEX "Contractor_status_idx" ON "Contractor"("status");

-- CreateIndex
CREATE INDEX "Contractor_assignedToId_idx" ON "Contractor"("assignedToId");

-- CreateIndex
CREATE UNIQUE INDEX "Contractor_name_address_key" ON "Contractor"("name", "address");

-- CreateIndex
CREATE UNIQUE INDEX "Member_name_key" ON "Member"("name");

-- CreateIndex
CREATE INDEX "ActivityLog_contractorId_idx" ON "ActivityLog"("contractorId");

-- CreateIndex
CREATE INDEX "ActivityLog_actor_idx" ON "ActivityLog"("actor");

-- AddForeignKey
ALTER TABLE "Contractor" ADD CONSTRAINT "Contractor_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
