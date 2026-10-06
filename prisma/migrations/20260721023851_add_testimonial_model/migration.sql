-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);
